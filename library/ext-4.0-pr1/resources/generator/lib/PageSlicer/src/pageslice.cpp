#include <QtGui>
#include <QtWebKit>
#include <iostream>

class WebPage: public QWebPage
{
    Q_OBJECT
public:
    WebPage(QObject *parent = 0);
public slots:
    bool shouldInterruptJavaScript();
};

WebPage::WebPage(QObject *parent)
    : QWebPage(parent)
{
}

bool WebPage::shouldInterruptJavaScript()
{
    QApplication::processEvents(QEventLoop::AllEvents, 100);
    return false;
}

class PageSlice: public QObject
{
    Q_OBJECT
public:
    PageSlice(const QString &fileName, const QString &prefix);

public slots:
    void log(const QString &msg);
    void capture();
    void save(int x1, int y1, int x2, int y2, const QString &outputFile);
    void reload();
    void sleep(int ms);
    void terminate();

private slots:
    void inject(bool ok);

private:
    WebPage m_page;
    QString m_fileName;
    QString m_prefix;
    QImage m_image;
};

PageSlice::PageSlice(const QString &fileName, const QString &prefix)
    : QObject()
    , m_fileName(fileName)
    , m_prefix(prefix)
{
    connect(&m_page, SIGNAL(loadFinished(bool)), SLOT(inject(bool)));
}

void PageSlice::inject(bool ok)
{
    if (!ok) {
        std::cerr << "Failed loading " << qPrintable(m_fileName) << std::endl;
        QApplication::instance()->exit(-1);
    }
    m_page.mainFrame()->addToJavaScriptWindowObject("PageSlice", this);

    QPalette palette = m_page.palette();
    palette.setBrush(QPalette::Base, Qt::transparent);
    m_page.setPalette(palette);
}

void PageSlice::log(const QString &msg)
{
    std::cout << qPrintable(msg) << std::endl;
}

void PageSlice::capture()
{
    QSize size = m_page.mainFrame()->contentsSize();
    m_image = QImage(size, QImage::Format_ARGB32_Premultiplied);
    m_image.fill(Qt::transparent);

    QPainter p(&m_image);
    p.setRenderHint(QPainter::Antialiasing, true);
    p.setRenderHint(QPainter::SmoothPixmapTransform, true);
    m_page.setViewportSize(m_page.mainFrame()->contentsSize());
    m_page.mainFrame()->render(&p);
    p.end();
}

void PageSlice::reload()
{
    m_image = QImage();
    m_page.mainFrame()->load(QUrl::fromUserInput(QFileInfo(m_fileName).absoluteFilePath()));
    m_page.setViewportSize(QSize(1024, 1024));
}

void PageSlice::save(int x, int y, int w, int h, const QString &outputFile)
{
    QString fullName = m_prefix + outputFile;
    QFileInfo fi(fullName);
    QDir dir;
    dir.mkpath(fi.absolutePath());
    QImage slice = m_image.copy(x, y, w, h);
    slice.save(fullName);
}

void PageSlice::sleep(int ms)
{
    QTime startTime = QTime::currentTime();
    while (true) {
        QApplication::processEvents(QEventLoop::AllEvents, 100);
        if (startTime.msecsTo(QTime::currentTime()) > ms)
            break;
    }
}

void PageSlice::terminate()
{
    QApplication::instance()->exit(0);
}

#include "pageslice.moc"

int main(int argc, char * argv[])
{
    if (argc != 2 && argc != 3) {
        std::cout << "Usage:" << std::endl;
        std::cout << "  pageslice input.html [prefix]" << std::endl << std::endl;
        std::cout << std::endl;
        return 0;
    }

    QApplication app(argc, argv);
    QString fname = QString::fromLocal8Bit(argv[1]);
    QString prefix = (argc == 3) ? QString::fromLocal8Bit(argv[2]) : QString();
    PageSlice capture(fname, prefix);
    capture.reload();
    return app.exec();
}

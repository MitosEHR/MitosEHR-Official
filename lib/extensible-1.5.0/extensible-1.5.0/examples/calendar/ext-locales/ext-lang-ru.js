/*!
 * Extensible 1.5.0
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
/*!
 * Extensible 1.5.0
 * Copyright(c) 2010-2011 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
﻿/**
 * Russian translation
 * By ZooKeeper (utf-8 encoding)
 * 6 November 2007
 */
Ext.onReady(function() {
    if(Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Идет загрузка...</div>';
    }

    if(Ext.view.View){
        Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
        Ext.grid.Panel.prototype.ddText = "{0} выбранных �?трок";
    }

    if(Ext.TabPanelItem){
        Ext.TabPanelItem.prototype.closeText = "Закрыть �?ту вкладку";
    }

    if(Ext.form.field.Base){
        Ext.form.field.Base.prototype.invalidText = "Значение в �?том поле неверное";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "Загрузка...";
    }

    if(Ext.Date){
        Ext.Date.monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "�?прель",
        "Май",
        "Июнь",
        "Июль",
        "�?вгу�?т",
        "Сент�?брь",
        "Окт�?брь",
        "�?о�?брь",
        "Декабрь"
        ];

        Ext.Date.shortMonthNames = [
        "Янв",
        "Февр",
        "Март",
        "�?пр",
        "Май",
        "Июнь",
        "Июль",
        "�?вг",
        "Сент",
        "Окт",
        "�?о�?б",
        "Дек"
        ];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNumbers = {
            'Янв': 0,
            'Фев': 1,
            'Мар': 2,
            '�?пр': 3,
            'Май': 4,
            'Июн': 5,
            'Июл': 6,
            '�?вг': 7,
            'Сен': 8,
            'Окт': 9,
            '�?о�?': 10,
            'Дек': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = [
        "Во�?кре�?енье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "П�?тница",
        "Суббота"
        ];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }
    if(Ext.MessageBox){
        Ext.MessageBox.buttonText = {
            ok     : "OK",
            cancel : "Отмена",
            yes    : "Да",
            no     : "�?ет"
        };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0440\u0443\u0431',  // Russian Ruble
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
        Ext.apply(Ext.picker.Date.prototype, {
            todayText          : "Сегодн�?",
            minText            : "Эта дата раньше минимальной даты",
            maxText            : "Эта дата позже мак�?имальной даты",
            disabledDaysText   : "",
            disabledDatesText  : "",
            monthNames         : Ext.Date.monthNames,
            dayNames           : Ext.Date.dayNames,
            nextText           : 'Следующий ме�?�?ц (Control+Вправо)',
            prevText           : 'Предыдущий ме�?�?ц (Control+Влево)',
            monthYearText      : 'Выбор ме�?�?ца (Control+Вверх/Вниз дл�? выбора года)',
            todayTip           : "{0} (Пробел)",
            format             : "d.m.y",
            startDay           : 1
        });
    }

    if(Ext.picker.Month) {
        Ext.apply(Ext.picker.Month.prototype, {
            okText             : "&#160;OK&#160;",
            cancelText         : "Отмена"
        });
    }

    if(Ext.toolbar.Paging){
        Ext.apply(Ext.PagingToolbar.prototype, {
            beforePageText : "Страница",
            afterPageText  : "из {0}",
            firstText      : "Перва�? �?траница",
            prevText       : "Предыдуща�? �?траница",
            nextText       : "Следующа�? �?траница",
            lastText       : "По�?ледн�?�? �?траница",
            refreshText    : "Обновить",
            displayMsg     : "Отображают�?�? запи�?и �? {0} по {1}, в�?его {2}",
            emptyMsg       : '�?ет данных дл�? отображени�?'
        });
    }

    if(Ext.form.field.Text){
        Ext.apply(Ext.form.field.Text.prototype, {
            minLengthText : "Минимальна�? длина �?того пол�? {0}",
            maxLengthText : "Мак�?имальна�? длина �?того пол�? {0}",
            blankText     : "Это поле об�?зательно дл�? заполнени�?",
            regexText     : "",
            emptyText     : null
        });
    }

    if(Ext.form.field.Number){
        Ext.apply(Ext.form.field.Number.prototype, {
            minText : "Значение �?того пол�? не может быть меньше {0}",
            maxText : "Значение �?того пол�? не может быть больше {0}",
            nanText : "{0} не �?вл�?ет�?�? чи�?лом"
        });
    }

    if(Ext.form.field.Date){
        Ext.apply(Ext.form.field.Date.prototype, {
            disabledDaysText  : "�?е до�?тупно",
            disabledDatesText : "�?е до�?тупно",
            minText           : "Дата в �?том поле должна быть позде {0}",
            maxText           : "Дата в �?том поле должна быть раньше {0}",
            invalidText       : "{0} не �?вл�?ет�?�? правильной датой - дата должна быть указана в формате {1}",
            format            : "d.m.y",
            altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
        });
    }

    if(Ext.form.field.ComboBox){
        Ext.apply(Ext.form.field.ComboBox.prototype, {
            loadingText       : "Загрузка...",
            valueNotFoundText : undefined
        });
    }

    if(Ext.form.field.VTypes){
        Ext.apply(Ext.form.field.VTypes, {
            emailText     : 'Это поле должно �?одержать адре�? �?лектронной почты в формате "user@example.com"',
            urlText       : 'Это поле должно �?одержать URL в формате "http:/'+'/www.example.com"',
            alphaText     : 'Это поле должно �?одержать только латин�?кие буквы и �?имвол подчеркивани�? "_"',
            alphanumText  : 'Это поле должно �?одержать только латин�?кие буквы, цифры и �?имвол подчеркивани�? "_"'
        });
    }

    if(Ext.form.field.HtmlEditor){
        Ext.apply(Ext.form.field.HtmlEditor.prototype, {
            createLinkText : 'Пожалуй�?та введите адре�?:',
            buttonTips : {
                bold : {
                    title: 'Полужирный (Ctrl+B)',
                    text: 'Применение полужирного начертани�? к выделенному тек�?ту.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic : {
                    title: 'Кур�?ив (Ctrl+I)',
                    text: 'Применение кур�?ивного начертани�? к выделенному тек�?ту.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline : {
                    title: 'Подчёркнутый (Ctrl+U)',
                    text: 'Подчёркивание выделенного тек�?та.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                increasefontsize : {
                    title: 'Увеличить размер',
                    text: 'Увеличение размера шрифта.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                decreasefontsize : {
                    title: 'Уменьшить размер',
                    text: 'Уменьшение размера шрифта.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                backcolor : {
                    title: 'Заливка',
                    text: 'Изменение цвета фона дл�? выделенного тек�?та или абзаца.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                forecolor : {
                    title: 'Цвет тек�?та',
                    text: 'Измение цвета тек�?та.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyleft : {
                    title: 'Выровн�?ть тек�?т по левому краю',
                    text: 'Выровнивание тек�?та по левому краю.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifycenter : {
                    title: 'По центру',
                    text: 'Выровнивание тек�?та по центру.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyright : {
                    title: 'Выровн�?ть тек�?т по правому краю',
                    text: 'Выровнивание тек�?та по правому краю.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertunorderedlist : {
                    title: 'Маркеры',
                    text: '�?ачать маркированный �?пи�?ок.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertorderedlist : {
                    title: '�?умераци�?',
                    text: '�?ачать нумернованный �?пи�?ок.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                createlink : {
                    title: 'В�?тавить гипер�?�?ылку',
                    text: 'Создание �?�?ылки из выделенного тек�?та.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                sourceedit : {
                    title: 'И�?ходный код',
                    text: 'Переключить�?�? на и�?ходный код.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                }
            }
        });
    }

    if(Ext.form.Basic){
        Ext.form.Basic.prototype.waitTitle = "Пожалуй�?та подождите...";
    }

    if(Ext.grid.header.Container){
        Ext.apply(Ext.grid.header.Container.prototype, {
            sortAscText  : "Сортировать по возра�?танию",
            sortDescText : "Сортировать по убыванию",
            lockText     : "Закрепить �?толбец",
            unlockText   : "Сн�?ть закрепление �?толбца",
            columnsText  : "Столбцы"
        });
    }

    if(Ext.grid.GroupingFeature){
        Ext.apply(Ext.grid.GroupingFeature.prototype, {
            emptyGroupText : '(Пу�?то)',
            groupByText    : 'Группировать по �?тому полю',
            showGroupsText : 'Отображать по группам'
        });
    }

    if(Ext.grid.PropertyColumnModel){
        Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
            nameText   : "�?азвание",
            valueText  : "Значение",
            dateFormat : "d.m.Y"
        });
    }

    if(Ext.SplitLayoutRegion){
        Ext.apply(Ext.SplitLayoutRegion.prototype, {
            splitTip            : "Т�?ните дл�? изменени�? размера.",
            collapsibleSplitTip : "Т�?ните дл�? изменени�? размера. Двойной щелчок �?пр�?чет панель."
        });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
        Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
            splitTip            : "Т�?ните дл�? изменени�? размера.",
            collapsibleSplitTip : "Т�?ните дл�? изменени�? размера. Двойной щелчок �?пр�?чет панель."
        });
    }
});
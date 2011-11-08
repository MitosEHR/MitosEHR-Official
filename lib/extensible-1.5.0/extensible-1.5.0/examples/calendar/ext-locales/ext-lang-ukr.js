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
/**
 * Ukrainian translations for ExtJS (UTF-8 encoding)
 *
 * Original translation by zlatko
 * 3 October 2007
 *
 * Updated by dev.ashevchuk@gmail.com
 * 01.09.2009
 */
Ext.onReady(function(){
    if(Ext.Updater){
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Завантаженн�?...</div>';
    }
    if(Ext.view.View){
       Ext.view.View.prototype.emptyText = "<Порожньо>";
    }

    if(Ext.grid.Panel){
       Ext.grid.Panel.prototype.ddText = "{0} обраних р�?дків";
    }

    if(Ext.TabPanelItem){
       Ext.TabPanelItem.prototype.closeText = "Закрити цю вкладку";
    }

    if(Ext.form.field.Base){
       Ext.form.field.Base.prototype.invalidText = "Хибне значенн�?";
    }

    if(Ext.LoadMask){
       Ext.LoadMask.prototype.msg = "Завантаженн�?...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
           "Січень",
           "Лютий",
           "Березень",
           "Квітень",
           "Травень",
           "Червень",
           "Липень",
           "Серпень",
           "Вере�?ень",
           "Жовтень",
           "Ли�?топад",
           "Грудень"
        ];

        Ext.Date.dayNames = [
           "�?еділ�?",
           "Понеділок",
           "Вівторок",
           "Середа",
           "Четвер",
           "П’�?тниц�?",
           "Субота"
        ];
    }

    if(Ext.MessageBox){
       Ext.MessageBox.buttonText = {
          ok     : "OK",
          cancel : "Відміна",
          yes    : "Так",
          no     : "�?і"
       };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20b4',  // Ukranian Hryvnia
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
       Ext.apply(Ext.picker.Date.prototype, {
          todayText         : "Сьогодні",
          minText           : "Ц�? дата меньша за мінімальну допу�?тиму дату",
          maxText           : "Ц�? дата більша за мак�?имальну допу�?тиму дату",
          disabledDaysText  : "",
          disabledDatesText : "",
          monthNames        : Ext.Date.monthNames,
          dayNames          : Ext.Date.dayNames,
          nextText          : '�?а�?тупний мі�?�?ць (Control+Вправо)',
          prevText          : 'Попередній мі�?�?ць (Control+Вліво)',
          monthYearText     : 'Вибір мі�?�?ц�? (Control+Вверх/Вниз дл�? вибору року)',
          todayTip          : "{0} (Пробіл)",
          format            : "d.m.y",
          startDay          : 1
       });
    }

    if(Ext.picker.Month) {
      Ext.apply(Ext.picker.Month.prototype, {
          okText            : "&#160;OK&#160;",
          cancelText        : "Відміна"
      });
    }

    if(Ext.toolbar.Paging){
       Ext.apply(Ext.PagingToolbar.prototype, {
          beforePageText : "Сторінка",
          afterPageText  : "з {0}",
          firstText      : "Перша �?торінка",
          prevText       : "Попередн�? �?торінка",
          nextText       : "�?а�?тупна �?торінка",
          lastText       : "О�?танн�? �?торінка",
          refreshText    : "О�?віжити",
          displayMsg     : "Відображенн�? запи�?ів з {0} по {1}, в�?ього {2}",
          emptyMsg       : 'Дані дл�? відображенн�? від�?утні'
       });
    }

    if(Ext.form.field.Text){
       Ext.apply(Ext.form.field.Text.prototype, {
          minLengthText : "Мінімальна довжина цього пол�? {0}",
          maxLengthText : "Мак�?имальна довжина цього пол�? {0}",
          blankText     : "Це поле є обов’�?зковим дл�? заповненн�?",
          regexText     : "",
          emptyText     : null
       });
    }

    if(Ext.form.field.Number){
       Ext.apply(Ext.form.field.Number.prototype, {
          minText : "Значенн�? у цьому полі не може бути меньше {0}",
          maxText : "Значенн�? у цьому полі не може бути більше {0}",
          nanText : "{0} не є чи�?лом"
       });
    }

    if(Ext.form.field.Date){
       Ext.apply(Ext.form.field.Date.prototype, {
          disabledDaysText  : "�?е до�?тупно",
          disabledDatesText : "�?е до�?тупно",
          minText           : "Дата у цьому полі повинна бути більша {0}",
          maxText           : "Дата у цьому полі повинна бути меньша {0}",
          invalidText       : "{0} хибна дата - дата повинна бути вказана у форматі {1}",
          format            : "d.m.y"
       });
    }

    if(Ext.form.field.ComboBox){
       Ext.apply(Ext.form.field.ComboBox.prototype, {
          loadingText       : "Завантаженн�?...",
          valueNotFoundText : undefined
       });
    }

    if(Ext.form.field.VTypes){
       Ext.apply(Ext.form.field.VTypes, {
          emailText    : 'Це поле повинно мі�?тити адре�?у електронної пошти у форматі "user@example.com"',
          urlText      : 'Це поле повинно мі�?тити URL у форматі "http:/'+'/www.example.com"',
          alphaText    : 'Це поле повинно мі�?тити виключно латин�?ькі літери та �?имвол підкре�?ленн�? "_"',
          alphanumText : 'Це поле повинно мі�?тити виключно латин�?ькі літери, цифри та �?имвол підкре�?ленн�? "_"'
       });
    }

    if(Ext.form.field.HtmlEditor){
       Ext.apply(Ext.form.field.HtmlEditor.prototype, {
         createLinkText : 'Будь-ла�?ка введіть адре�?у:',
         buttonTips : {
                bold : {
                   title: '�?апівжирний (Ctrl+B)',
                   text: 'Зробити напівжирним виділений тек�?т.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic : {
                   title: 'Кур�?ив (Ctrl+I)',
                   text: 'Зробити кур�?ивом виділений тек�?т.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline : {
                   title: 'Підкре�?лений (Ctrl+U)',
                   text: 'Зробити підкре�?леним виділений тек�?т.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               increasefontsize : {
                   title: 'Збільшити розмір',
                   text: 'Збільшити розмір шрифта.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               decreasefontsize : {
                   title: 'Зменьшити розмір',
                   text: 'Зменьшити розмір шрифта.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               backcolor : {
                   title: 'Заливка',
                   text: 'Змінити колір фону дл�? виділеного тек�?ту або абзацу.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               forecolor : {
                   title: 'Колір тек�?ту',
                   text: 'Змінити колір виділеного тек�?ту або абзацу.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               justifyleft : {
                   title: 'Вирівн�?ти тек�?т по лівому полю',
                   text: 'Вирівнюванн�? тек�?ту по лівому полю.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               justifycenter : {
                   title: 'Вирівн�?ти тек�?т по центру',
                   text: 'Вирівнюванн�? тек�?ту по центру.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               justifyright : {
                   title: 'Вирівн�?ти тек�?т по правому полю',
                   text: 'Вирівнюванн�? тек�?ту по правому полю.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               insertunorderedlist : {
                   title: 'Маркери',
                   text: 'Почати маркований �?пи�?ок.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               insertorderedlist : {
                   title: '�?умераці�?',
                   text: 'Почати нумернований �?пи�?ок.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               createlink : {
                   title: 'В�?тавити гіперпо�?иланн�?',
                   text: 'Створенн�? по�?иланн�? із виділеного тек�?ту.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               },
               sourceedit : {
                   title: 'Джерельний код',
                   text: 'Режим редагуванн�? джерельного коду.',
                   cls: Ext.baseCSSPrefix + 'html-editor-tip'
               }
            }
       });
    }

    if(Ext.grid.header.Container){
       Ext.apply(Ext.grid.header.Container.prototype, {
          sortAscText  : "Сортувати по зро�?танню",
          sortDescText : "Сортувати по �?паданню",
          lockText     : "Закріпити �?товпець",
          unlockText   : "Відкріпити �?товпець",
          columnsText  : "Стовпці"
       });
    }

    if(Ext.grid.PropertyColumnModel){
       Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
          nameText   : "�?азва",
          valueText  : "Значенн�?",
          dateFormat : "j.m.Y"
       });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
       Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
          splitTip            : "Т�?гніть дл�? зміни розміру.",
          collapsibleSplitTip : "Т�?гніть дл�? зміни розміру. Подвійний клік �?ховає панель."
       });
    }
});

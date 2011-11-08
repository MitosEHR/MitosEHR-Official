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
 * Serbian Cyrillic Translation
 * by Čolovic Vladan (cyrillic, utf8 encoding)
 * sr_RS (ex: sr_CS, sr_YU)
 * 12 May 2007
 */
Ext.onReady(function() {
    if(Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Учитавам...</div>';
    }

    if(Ext.view.View){
       Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
       Ext.grid.Panel.prototype.ddText = "{0} изабраних редова";
    }

    if(Ext.TabPanelItem){
       Ext.TabPanelItem.prototype.closeText = "Затвори ову »картицу«";
    }

    if(Ext.form.field.Base){
       Ext.form.field.Base.prototype.invalidText = "Унешена вредно�?т није правилна";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "Учитавам...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
           "Јануар",
           "Фебруар",
           "Март",
           "�?прил",
           "Мај",
           "Јун",
           "Јул",
           "�?вгу�?т",
           "Септембар",
           "Октобар",
           "�?овембар",
           "Децембар"
        ];

        Ext.Date.dayNames = [
           "�?едеља",
           "Понедељак",
           "Уторак",
           "Среда",
           "Четвртак",
           "Петак",
           "Субота"
        ];
    }

    if(Ext.MessageBox){
       Ext.MessageBox.buttonText = {
          ok     : "У реду",
          cancel : "Оду�?тани",
          yes    : "Да",
          no     : "�?е"
       };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0414\u0438\u043d\u002e',  // Serbian Dinar
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
       Ext.apply(Ext.picker.Date.prototype, {
          todayText         : "Дана�?",
          minText           : "Датум је и�?пред најмањег дозвољеног датума",
          maxText           : "Датум је након највећег дозвољеног датума",
          disabledDaysText  : "",
          disabledDatesText : "",
          monthNames	: Ext.Date.monthNames,
          dayNames		: Ext.Date.dayNames,
          nextText          : 'Следећи ме�?ец (Control+Де�?но)',
          prevText          : 'Претходни ме�?ец (Control+Лево)',
          monthYearText     : 'Изаберите ме�?ец (Control+Горе/Доле за избор године)',
          todayTip          : "{0} (Размакница)",
          format            : "d.m.y",
          startDay 		 : 1
       });
    }

    if(Ext.toolbar.Paging){
       Ext.apply(Ext.PagingToolbar.prototype, {
          beforePageText : "Страна",
          afterPageText  : "од {0}",
          firstText      : "Прва �?трана",
          prevText       : "Претходна �?трана",
          nextText       : "Следећа �?трана",
          lastText       : "По�?ледња �?трана",
          refreshText    : "О�?вежи",
          displayMsg     : "Приказана {0} - {1} од {2}",
          emptyMsg       : '�?емам шта приказати'
       });
    }

    if(Ext.form.field.Text){
       Ext.apply(Ext.form.field.Text.prototype, {
          minLengthText : "Минимална дужина овог поља је {0}",
          maxLengthText : "Мак�?имална дужина овог поља је {0}",
          blankText     : "Поље је обавезно",
          regexText     : "",
          emptyText     : null
       });
    }

    if(Ext.form.field.Number){
       Ext.apply(Ext.form.field.Number.prototype, {
          minText : "Минимална вредно�?т у пољу је {0}",
          maxText : "Мак�?имална вредно�?т у пољу је {0}",
          nanText : "{0} није правилан број"
       });
    }

    if(Ext.form.field.Date){
       Ext.apply(Ext.form.field.Date.prototype, {
          disabledDaysText  : "Па�?ивно",
          disabledDatesText : "Па�?ивно",
          minText           : "Датум у овом пољу мора бити након {0}",
          maxText           : "Датум у овом пољу мора бити пре {0}",
          invalidText       : "{0} није правилан датум - захтевани облик је {1}",
          format            : "d.m.y"
       });
    }

    if(Ext.form.field.ComboBox){
       Ext.apply(Ext.form.field.ComboBox.prototype, {
          loadingText       : "Учитавам...",
          valueNotFoundText : undefined
       });
    }

    if(Ext.form.field.VTypes){
       Ext.apply(Ext.form.field.VTypes, {
          emailText    : 'Ово поље прихвата e-mail адре�?у и�?кључиво у облику "korisnik@domen.com"',
          urlText      : 'Ово поље прихвата URL адре�?у и�?кључиво у облику "http:/'+'/www.domen.com"',
          alphaText    : 'Ово поље може �?адржати и�?кључиво �?лова и знак _',
          alphanumText : 'Ово поље може �?адржати �?амо �?лова, бројеве и знак _'
       });
    }

    if(Ext.grid.header.Container){
       Ext.apply(Ext.grid.header.Container.prototype, {
          sortAscText  : "Ра�?тући редо�?лед",
          sortDescText : "Опадајући редо�?лед",
          lockText     : "Закључај колону",
          unlockText   : "Откључај колону",
          columnsText  : "Колоне"
       });
    }

    if(Ext.grid.PropertyColumnModel){
       Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
          nameText   : "�?азив",
          valueText  : "Вредно�?т",
          dateFormat : "d.m.Y"
       });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
       Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
          splitTip            : "Повући за измену величине.",
          collapsibleSplitTip : "Повући за измену величине. Дво�?труки клик за �?акривање."
       });
    }
});
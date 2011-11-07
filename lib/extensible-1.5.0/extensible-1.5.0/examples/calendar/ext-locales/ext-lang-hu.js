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
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * Hungarian Translations (utf-8 encoded)
 * by Amon <amon@theba.hu> (27 Apr 2008)
 * encoding fixed by Vili (17 Feb 2009)
 */
Ext.onReady(function() {
    if(Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Betöltés...</div>';
    }

    if(Ext.view.View){
      Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
      Ext.grid.Panel.prototype.ddText = "{0} kiválasztott sor";
    }

    if(Ext.TabPanelItem){
      Ext.TabPanelItem.prototype.closeText = "Fül bezárása";
    }

    if(Ext.form.field.Base){
      Ext.form.field.Base.prototype.invalidText = "Hibás érték!";
    }

    if(Ext.LoadMask){
      Ext.LoadMask.prototype.msg = "Betöltés...";
    }

    if (Ext.Date) {
        Ext.Date.monthNames = [
          "Január",
          "Február",
          "Március",
          "�?prilis",
          "Május",
          "Június",
          "Július",
          "Augusztus",
          "Szeptember",
          "Október",
          "November",
          "December"
        ];

        Ext.Date.getShortMonthName = function(month) {
          return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
          'Jan' : 0,
          'Feb' : 1,
          'Már' : 2,
          '�?pr' : 3,
          'Máj' : 4,
          'Jún' : 5,
          'Júl' : 6,
          'Aug' : 7,
          'Sze' : 8,
          'Okt' : 9,
          'Nov' : 10,
          'Dec' : 11
        };

        Ext.Date.getMonthNumber = function(name) {
          return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = [
          "Vasárnap",
          "Hétfő",
          "Kedd",
          "Szerda",
          "Csütörtök",
          "Péntek",
          "Szombat"
        ];

        Ext.Date.getShortDayName = function(day) {
          return Ext.Date.dayNames[day].substring(0, 3);
        };
    }
    
    if(Ext.MessageBox){
      Ext.MessageBox.buttonText = {
        ok     : "OK",
        cancel : "Mégsem",
        yes    : "Igen",
        no     : "Nem"
      };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'Ft',  // Hungarian Forint
            dateFormat: 'Y m d'
        });
    }

    if(Ext.picker.Date){
      Ext.apply(Ext.picker.Date.prototype, {
        todayText         : "Mai nap",
        minText           : "A dátum korábbi a megengedettnél",
        maxText           : "A dátum későbbi a megengedettnél",
        disabledDaysText  : "",
        disabledDatesText : "",
        monthNames        : Ext.Date.monthNames,
        dayNames          : Ext.Date.dayNames,
        nextText          : 'Köv. hónap (CTRL+Jobbra)',
        prevText          : 'Előző hónap (CTRL+Balra)',
        monthYearText     : 'Válassz hónapot (Évválasztás: CTRL+Fel/Le)',
        todayTip          : "{0} (Szóköz)",
        format            : "y-m-d",
        startDay          : 0
      });
    }

    if(Ext.picker.Month) {
      Ext.apply(Ext.picker.Month.prototype, {
          okText            : "&#160;OK&#160;",
          cancelText        : "Mégsem"
      });
    }

    if(Ext.toolbar.Paging){
      Ext.apply(Ext.PagingToolbar.prototype, {
        beforePageText : "Oldal",
        afterPageText  : "a {0}-ból/ből",
        firstText      : "Első oldal",
        prevText       : "Előző oldal",
        nextText       : "Következő oldal",
        lastText       : "Utolsó oldal",
        refreshText    : "Frissítés",
        displayMsg     : "{0} - {1} sorok láthatók a {2}-ból/ből",
        emptyMsg       : 'Nincs megjeleníthető adat'
      });
    }

    if(Ext.form.field.Text){
      Ext.apply(Ext.form.field.Text.prototype, {
        minLengthText : "A mező tartalma legalább {0} hosszú kell legyen",
        maxLengthText : "A mező tartalma legfeljebb {0} hosszú lehet",
        blankText     : "Kötelezően kitöltendő mező",
        regexText     : "",
        emptyText     : null
      });
    }

    if(Ext.form.field.Number){
      Ext.apply(Ext.form.field.Number.prototype, {
        minText : "A mező tartalma nem lehet kissebb, mint {0}",
        maxText : "A mező tartalma nem lehet nagyobb, mint {0}",
        nanText : "{0} nem szám"
      });
    }

    if(Ext.form.field.Date){
      Ext.apply(Ext.form.field.Date.prototype, {
        disabledDaysText  : "Nem választható",
        disabledDatesText : "Nem választható",
        minText           : "A dátum nem lehet korábbi, mint {0}",
        maxText           : "A dátum nem lehet későbbi, mint {0}",
        invalidText       : "{0} nem megfelelő dátum - a helyes formátum: {1}",
        format            : "Y m d",
        altFormats        : "Y-m-d|y-m-d|y/m/d|m/d|m-d|md|ymd|Ymd|d"
      });
    }

    if(Ext.form.field.ComboBox){
      Ext.apply(Ext.form.field.ComboBox.prototype, {
        loadingText       : "Betöltés...",
        valueNotFoundText : undefined
      });
    }

    if(Ext.form.field.VTypes){
      Ext.apply(Ext.form.field.VTypes, {
        emailText    : 'A mező email címet tartalmazhat, melynek formátuma "felhasználó@szolgáltató.hu"',
        urlText      : 'A mező webcímet tartalmazhat, melynek formátuma "http:/'+'/www.weboldal.hu"',
        alphaText    : 'A mező csak betűket és aláhúzást (_) tartalmazhat',
        alphanumText : 'A mező csak betűket, számokat és aláhúzást (_) tartalmazhat'
      });
    }

    if(Ext.form.field.HtmlEditor){
      Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        createLinkText : 'Add meg a webcímet:',
        buttonTips : {
          bold : {
            title: 'Félkövér (Ctrl+B)',
            text: 'Félkövérré teszi a kijelölt szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          italic : {
            title: 'Dőlt (Ctrl+I)',
            text: 'Dőlté teszi a kijelölt szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          underline : {
            title: 'Aláhúzás (Ctrl+U)',
            text: 'Aláhúzza a kijelölt szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          increasefontsize : {
            title: 'Szöveg nagyítás',
            text: 'Növeli a szövegméretet.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          decreasefontsize : {
            title: 'Szöveg kicsinyítés',
            text: 'Csökkenti a szövegméretet.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          backcolor : {
            title: 'Háttérszín',
            text: 'A kijelölt szöveg háttérszínét módosítja.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          forecolor : {
            title: 'Szövegszín',
            text: 'A kijelölt szöveg színét módosítja.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifyleft : {
            title: 'Balra zárt',
            text: 'Balra zárja a szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifycenter : {
            title: 'Középre zárt',
            text: 'Középre zárja a szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifyright : {
            title: 'Jobbra zárt',
            text: 'Jobbra zárja a szöveget.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          insertunorderedlist : {
            title: 'Felsorolás',
            text: 'Felsorolást kezd.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          insertorderedlist : {
            title: 'Számozás',
            text: 'Számozott listát kezd.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          createlink : {
            title: 'Hiperlink',
            text: 'A kijelölt szöveget linkké teszi.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          sourceedit : {
            title: 'Forrás nézet',
            text: 'Forrás nézetbe kapcsol.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          }
        }
      });
    }

    if(Ext.grid.header.Container){
      Ext.apply(Ext.grid.header.Container.prototype, {
        sortAscText  : "Növekvő rendezés",
        sortDescText : "Csökkenő rendezés",
        lockText     : "Oszlop zárolás",
        unlockText   : "Oszlop feloldás",
        columnsText  : "Oszlopok"
      });
    }

    if(Ext.grid.GroupingFeature){
      Ext.apply(Ext.grid.GroupingFeature.prototype, {
        emptyGroupText : '(Nincs)',
        groupByText    : 'Oszlop szerint csoportosítás',
        showGroupsText : 'Csoportos nézet'
      });
    }

    if(Ext.grid.PropertyColumnModel){
      Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
        nameText   : "Név",
        valueText  : "Érték",
        dateFormat : "Y m j"
      });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
      Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
        splitTip            : "�?tméretezés húzásra.",
        collapsibleSplitTip : "�?tméretezés húzásra. Eltüntetés duplaklikk."
      });
    }
});
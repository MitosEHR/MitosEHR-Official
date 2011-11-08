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
 * Latvian Translations
 * By salix 17 April 2007
 */
Ext.onReady(function() {
    if(Ext.Updater){
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Notiek iel�?de...</div>';
    }
    if(Ext.view.View){
        Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
        Ext.grid.Panel.prototype.ddText = "{0} iezīmētu rindu";
    }

    if(Ext.TabPanelItem){
        Ext.TabPanelItem.prototype.closeText = "Aizver šo zīmni";
    }

    if(Ext.form.field.Base){
        Ext.form.field.Base.prototype.invalidText = "Vērtība šaj�? lauk�? nav pareiza";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "Iel�?dē...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
        "Janv�?ris",
        "Febru�?ris",
        "Marts",
        "Aprīlis",
        "Maijs",
        "Jūnijs",
        "Jūlijs",
        "Augusts",
        "Septembris",
        "Oktobris",
        "Novembris",
        "Decembris"
        ];

        Ext.Date.dayNames = [
        "Svētdiena",
        "Pirmdiena",
        "Otrdiena",
        "Trešdiena",
        "Ceturtdiena",
        "Piektdiena",
        "Sestdiena"
        ];
    }

    if(Ext.MessageBox){
        Ext.MessageBox.buttonText = {
            ok     : "Labi",
            cancel : "Atcelt",
            yes    : "J�?",
            no     : "Nē"
        };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'Ls',  // Latvian Lati
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
        Ext.apply(Ext.picker.Date.prototype, {
            todayText         : "Šodiena",
            minText           : "Nor�?dītais datums ir maz�?ks par minim�?lo datumu",
            maxText           : "Nor�?dītais datums ir liel�?ks par maksim�?lo datumu",
            disabledDaysText  : "",
            disabledDatesText : "",
            monthNames	: Ext.Date.monthNames,
            dayNames		: Ext.Date.dayNames,
            nextText          : 'N�?kamais mēnesis (Control+pa labi)',
            prevText          : 'Iepriekšējais mēnesis (Control+pa kreisi)',
            monthYearText     : 'Mēneša izvēle (Control+uz augšu/uz leju lai p�?rslēgtu gadus)',
            todayTip          : "{0} (Tukšumzīme)",
            format            : "d.m.Y",
            startDay          : 1
        });
    }

    if(Ext.toolbar.Paging){
        Ext.apply(Ext.PagingToolbar.prototype, {
            beforePageText : "Lapa",
            afterPageText  : "no {0}",
            firstText      : "Pirm�? lapa",
            prevText       : "iepriekšēj�? lapa",
            nextText       : "N�?kam�? lapa",
            lastText       : "Pēdēj�? lapa",
            refreshText    : "Atsvaidzin�?t",
            displayMsg     : "R�?da no {0} līdz {1} ierakstiem, kop�? {2}",
            emptyMsg       : 'Nav datu, ko par�?dīt'
        });
    }

    if(Ext.form.field.Text){
        Ext.apply(Ext.form.field.Text.prototype, {
            minLengthText : "Minim�?lais garums šim laukam ir {0}",
            maxLengthText : "Maksim�?lais garums šim laukam ir {0}",
            blankText     : "Šis ir oblig�?ts lauks",
            regexText     : "",
            emptyText     : null
        });
    }

    if(Ext.form.field.Number){
        Ext.apply(Ext.form.field.Number.prototype, {
            minText : "Minim�?lais garums šim laukam ir  {0}",
            maxText : "Maksim�?lais garums šim laukam ir  {0}",
            nanText : "{0} nav pareizs skaitlis"
        });
    }

    if(Ext.form.field.Date){
        Ext.apply(Ext.form.field.Date.prototype, {
            disabledDaysText  : "Atspējots",
            disabledDatesText : "Atspējots",
            minText           : "Datumam šaj�? lauk�? j�?būt liel�?kam k�? {0}",
            maxText           : "Datumam šaj�? lauk�? j�?būt maz�?kam k�? {0}",
            invalidText       : "{0} nav pareizs datums - tam j�?būt š�?d�? form�?t�?: {1}",
            format            : "d.m.Y"
        });
    }

    if(Ext.form.field.ComboBox){
        Ext.apply(Ext.form.field.ComboBox.prototype, {
            loadingText       : "Iel�?dē...",
            valueNotFoundText : undefined
        });
    }

    if(Ext.form.field.VTypes){
        Ext.apply(Ext.form.field.VTypes, {
            emailText    : 'Šaj�? lauk�? j�?ieraksta e-pasta adrese form�?t�? "lietot�?s@domēns.lv"',
            urlText      : 'Šaj�? lauk�? j�?ieraksta URL form�?t�? "http:/'+'/www.domēns.lv"',
            alphaText    : 'Šis lauks drīkst saturēt tikai burtus un _ zīmi',
            alphanumText : 'Šis lauks drīkst saturēt tikai burtus, ciparus un _ zīmi'
        });
    }

    if(Ext.grid.header.Container){
        Ext.apply(Ext.grid.header.Container.prototype, {
            sortAscText  : "K�?rtot pieaugoš�? secīb�?",
            sortDescText : "K�?rtot dilstoš�? secīb�?",
            lockText     : "Noslēgt kolonnu",
            unlockText   : "Atslēgt kolonnu",
            columnsText  : "Kolonnas"
        });
    }

    if(Ext.grid.PropertyColumnModel){
        Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
            nameText   : "Nosaukums",
            valueText  : "Vērtība",
            dateFormat : "j.m.Y"
        });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
        Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
            splitTip            : "Velc, lai mainītu izmēru.",
            collapsibleSplitTip : "Velc, lai mainītu izmēru. Dubultklikšķis noslēpj apgabalu."
        });
    }
});
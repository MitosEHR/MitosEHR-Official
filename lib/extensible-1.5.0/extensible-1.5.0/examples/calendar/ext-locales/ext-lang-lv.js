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
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Notiek ielÄ?de...</div>';
    }
    if(Ext.view.View){
        Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
        Ext.grid.Panel.prototype.ddText = "{0} iezÄ«mÄ“tu rindu";
    }

    if(Ext.TabPanelItem){
        Ext.TabPanelItem.prototype.closeText = "Aizver Å¡o zÄ«mni";
    }

    if(Ext.form.field.Base){
        Ext.form.field.Base.prototype.invalidText = "VÄ“rtÄ«ba Å¡ajÄ? laukÄ? nav pareiza";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "IelÄ?dÄ“...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
        "JanvÄ?ris",
        "FebruÄ?ris",
        "Marts",
        "AprÄ«lis",
        "Maijs",
        "JÅ«nijs",
        "JÅ«lijs",
        "Augusts",
        "Septembris",
        "Oktobris",
        "Novembris",
        "Decembris"
        ];

        Ext.Date.dayNames = [
        "SvÄ“tdiena",
        "Pirmdiena",
        "Otrdiena",
        "TreÅ¡diena",
        "Ceturtdiena",
        "Piektdiena",
        "Sestdiena"
        ];
    }

    if(Ext.MessageBox){
        Ext.MessageBox.buttonText = {
            ok     : "Labi",
            cancel : "Atcelt",
            yes    : "JÄ?",
            no     : "NÄ“"
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
            todayText         : "Å odiena",
            minText           : "NorÄ?dÄ«tais datums ir mazÄ?ks par minimÄ?lo datumu",
            maxText           : "NorÄ?dÄ«tais datums ir lielÄ?ks par maksimÄ?lo datumu",
            disabledDaysText  : "",
            disabledDatesText : "",
            monthNames	: Ext.Date.monthNames,
            dayNames		: Ext.Date.dayNames,
            nextText          : 'NÄ?kamais mÄ“nesis (Control+pa labi)',
            prevText          : 'IepriekÅ¡Ä“jais mÄ“nesis (Control+pa kreisi)',
            monthYearText     : 'MÄ“neÅ¡a izvÄ“le (Control+uz augÅ¡u/uz leju lai pÄ?rslÄ“gtu gadus)',
            todayTip          : "{0} (TukÅ¡umzÄ«me)",
            format            : "d.m.Y",
            startDay          : 1
        });
    }

    if(Ext.toolbar.Paging){
        Ext.apply(Ext.PagingToolbar.prototype, {
            beforePageText : "Lapa",
            afterPageText  : "no {0}",
            firstText      : "PirmÄ? lapa",
            prevText       : "iepriekÅ¡Ä“jÄ? lapa",
            nextText       : "NÄ?kamÄ? lapa",
            lastText       : "PÄ“dÄ“jÄ? lapa",
            refreshText    : "AtsvaidzinÄ?t",
            displayMsg     : "RÄ?da no {0} lÄ«dz {1} ierakstiem, kopÄ? {2}",
            emptyMsg       : 'Nav datu, ko parÄ?dÄ«t'
        });
    }

    if(Ext.form.field.Text){
        Ext.apply(Ext.form.field.Text.prototype, {
            minLengthText : "MinimÄ?lais garums Å¡im laukam ir {0}",
            maxLengthText : "MaksimÄ?lais garums Å¡im laukam ir {0}",
            blankText     : "Å is ir obligÄ?ts lauks",
            regexText     : "",
            emptyText     : null
        });
    }

    if(Ext.form.field.Number){
        Ext.apply(Ext.form.field.Number.prototype, {
            minText : "MinimÄ?lais garums Å¡im laukam ir  {0}",
            maxText : "MaksimÄ?lais garums Å¡im laukam ir  {0}",
            nanText : "{0} nav pareizs skaitlis"
        });
    }

    if(Ext.form.field.Date){
        Ext.apply(Ext.form.field.Date.prototype, {
            disabledDaysText  : "AtspÄ“jots",
            disabledDatesText : "AtspÄ“jots",
            minText           : "Datumam Å¡ajÄ? laukÄ? jÄ?bÅ«t lielÄ?kam kÄ? {0}",
            maxText           : "Datumam Å¡ajÄ? laukÄ? jÄ?bÅ«t mazÄ?kam kÄ? {0}",
            invalidText       : "{0} nav pareizs datums - tam jÄ?bÅ«t Å¡Ä?dÄ? formÄ?tÄ?: {1}",
            format            : "d.m.Y"
        });
    }

    if(Ext.form.field.ComboBox){
        Ext.apply(Ext.form.field.ComboBox.prototype, {
            loadingText       : "IelÄ?dÄ“...",
            valueNotFoundText : undefined
        });
    }

    if(Ext.form.field.VTypes){
        Ext.apply(Ext.form.field.VTypes, {
            emailText    : 'Å ajÄ? laukÄ? jÄ?ieraksta e-pasta adrese formÄ?tÄ? "lietotÄ?s@domÄ“ns.lv"',
            urlText      : 'Å ajÄ? laukÄ? jÄ?ieraksta URL formÄ?tÄ? "http:/'+'/www.domÄ“ns.lv"',
            alphaText    : 'Å is lauks drÄ«kst saturÄ“t tikai burtus un _ zÄ«mi',
            alphanumText : 'Å is lauks drÄ«kst saturÄ“t tikai burtus, ciparus un _ zÄ«mi'
        });
    }

    if(Ext.grid.header.Container){
        Ext.apply(Ext.grid.header.Container.prototype, {
            sortAscText  : "KÄ?rtot pieaugoÅ¡Ä? secÄ«bÄ?",
            sortDescText : "KÄ?rtot dilstoÅ¡Ä? secÄ«bÄ?",
            lockText     : "NoslÄ“gt kolonnu",
            unlockText   : "AtslÄ“gt kolonnu",
            columnsText  : "Kolonnas"
        });
    }

    if(Ext.grid.PropertyColumnModel){
        Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
            nameText   : "Nosaukums",
            valueText  : "VÄ“rtÄ«ba",
            dateFormat : "j.m.Y"
        });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
        Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
            splitTip            : "Velc, lai mainÄ«tu izmÄ“ru.",
            collapsibleSplitTip : "Velc, lai mainÄ«tu izmÄ“ru. DubultklikÅ¡Ä·is noslÄ“pj apgabalu."
        });
    }
});
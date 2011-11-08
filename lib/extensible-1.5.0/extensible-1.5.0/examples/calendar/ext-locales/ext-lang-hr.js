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
 * Croatian translation
 * By Ylodi (utf8 encoding)
 * 8 May 2007
 *
 * By Stjepan at gmail dot com (utf8 encoding)
 * 17 May 2008
 */
Ext.onReady(function() {
    if(Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">UÄ?itavanje...</div>';
    }

    if(Ext.view.View){
        Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
        Ext.grid.Panel.prototype.ddText = "{0} odabranih redova";
    }

    if(Ext.TabPanelItem){
        Ext.TabPanelItem.prototype.closeText = "Zatvori ovaj tab";
    }

    if(Ext.form.field.Base){
        Ext.form.field.Base.prototype.invalidText = "Unesena vrijednost u ovom polju je neispravna";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "UÄ?itavanje...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
        "SijeÄ?anj",
        "VeljaÄ?a",
        "OÅ¾ujak",
        "Travanj",
        "Svibanj",
        "Lipanj",
        "Srpanj",
        "Kolovoz",
        "Rujan",
        "Listopad",
        "Studeni",
        "Prosinac"
        ];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Jan : 0,
            Feb : 1,
            Mar : 2,
            Apr : 3,
            May : 4,
            Jun : 5,
            Jul : 6,
            Aug : 7,
            Sep : 8,
            Oct : 9,
            Nov : 10,
            Dec : 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = [
        "Nedjelja",
        "Ponedjeljak",
        "Utorak",
        "Srijeda",
        "ÄŒetvrtak",
        "Petak",
        "Subota"
        ];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }
    
    if(Ext.MessageBox){
        Ext.MessageBox.buttonText = {
            ok     : "U redu",
            cancel : "Odustani",
            yes    : "Da",
            no     : "Ne"
        };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'kn',  // Croation Kuna
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
        Ext.apply(Ext.picker.Date.prototype, {
            todayText         : "Danas",
            minText           : "Taj datum je prije najmanjeg datuma",
            maxText           : "Taj datum je poslije najveÄ‡eg datuma",
            disabledDaysText  : "",
            disabledDatesText : "",
            monthNames	: Ext.Date.monthNames,
            dayNames		: Ext.Date.dayNames,
            nextText          : 'SlijedeÄ‡i mjesec (Control+Desno)',
            prevText          : 'Prethodni mjesec (Control+Lijevo)',
            monthYearText     : 'Odaberite mjesec (Control+Gore/Dolje za promjenu godine)',
            todayTip          : "{0} (Razmaknica)",
            format            : "d.m.y",
            startDay 		 : 1
        });
    }

    if(Ext.picker.Month) {
        Ext.apply(Ext.picker.Month.prototype, {
            okText            : "&#160;U redu&#160;",
            cancelText        : "Odustani"
        });
    }

    if(Ext.toolbar.Paging){
        Ext.apply(Ext.PagingToolbar.prototype, {
            beforePageText : "Stranica",
            afterPageText  : "od {0}",
            firstText      : "Prva stranica",
            prevText       : "Prethodna stranica",
            nextText       : "SlijedeÄ‡a stranica",
            lastText       : "Posljednja stranica",
            refreshText    : "Obnovi",
            displayMsg     : "Prikazujem {0} - {1} od {2}",
            emptyMsg       : 'Nema podataka za prikaz'
        });
    }

    if(Ext.form.field.Text){
        Ext.apply(Ext.form.field.Text.prototype, {
            minLengthText : "Minimalna duÅ¾ina za ovo polje je {0}",
            maxLengthText : "Maksimalna duÅ¾ina za ovo polje je {0}",
            blankText     : "Ovo polje je obavezno",
            regexText     : "",
            emptyText     : null
        });
    }

    if(Ext.form.field.Number){
        Ext.apply(Ext.form.field.Number.prototype, {
            minText : "Minimalna vrijednost za ovo polje je {0}",
            maxText : "Maksimalna vrijednost za ovo polje je {0}",
            nanText : "{0} nije ispravan broj"
        });
    }

    if(Ext.form.field.Date){
        Ext.apply(Ext.form.field.Date.prototype, {
            disabledDaysText  : "Neaktivno",
            disabledDatesText : "Neaktivno",
            minText           : "Datum u ovom polje mora biti poslije {0}",
            maxText           : "Datum u ovom polju mora biti prije {0}",
            invalidText       : "{0} nije ispravan datum - mora biti u obliku {1}",
            format            : "d.m.y"
        });
    }

    if(Ext.form.field.ComboBox){
        Ext.apply(Ext.form.field.ComboBox.prototype, {
            loadingText       : "UÄ?itavanje...",
            valueNotFoundText : undefined
        });
    }

    if(Ext.form.field.VTypes){
        Ext.apply(Ext.form.field.VTypes, {
            emailText    : 'Ovdje moÅ¾ete unijeti samo e-mail adresu u obliku "korisnik@domena.com"',
            urlText      : 'Ovdje moÅ¾ete unijeti samo URL u obliku "http:/'+'/www.domena.com"',
            alphaText    : 'Ovo polje moÅ¾e sadrÅ¾avati samo slova i znak _',
            alphanumText : 'Ovo polje moÅ¾e sadrÅ¾avati samo slova, brojeve i znak _'
        });
    }

    if(Ext.form.field.HtmlEditor){
        Ext.apply(Ext.form.field.HtmlEditor.prototype, {
            createLinkText : 'Unesite URL za link:',
            buttonTips : {
                bold : {
                    title: 'Podebljano (Ctrl+B)',
                    text: 'Podebljavanje oznaÄ?enog teksta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic : {
                    title: 'Kurziv (Ctrl+I)',
                    text: 'Pretvaranje oznaÄ?enog tekst u kurziv',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline : {
                    title: 'Podcrtano (Ctrl+U)',
                    text: 'Potcrtavanje oznaÄ?enog teksta',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                increasefontsize : {
                    title: 'PoveÄ‡anje teksta',
                    text: 'PoveÄ‡avanje veliÄ?ine fonta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                decreasefontsize : {
                    title: 'Smanjivanje teksta',
                    text: 'Smanjivanje veliÄ?ine fonta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                backcolor : {
                    title: 'Boja oznaÄ?enog teksta',
                    text: 'Promjena boje pozadine oznaÄ?enog teksta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                forecolor : {
                    title: 'Boja fonta',
                    text: 'Promjena boje oznaÄ?enog teksta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyleft : {
                    title: 'Lijevo poravnanje teksta',
                    text: 'Poravnanje teksta na lijevu stranu.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifycenter : {
                    title: 'Centriranje teksta',
                    text: 'Centriranje teksta u ureÄ‘ivaÄ?u teksta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyright : {
                    title: 'Desno poravnanje teksta',
                    text: 'Poravnanje teksta na desnu stranu.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertunorderedlist : {
                    title: 'OznaÄ?ena lista',
                    text: 'ZapoÄ?injanje oznaÄ?ene liste.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertorderedlist : {
                    title: 'Numerirana lista',
                    text: 'ZapoÄ?injanje numerirane liste.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                createlink : {
                    title: 'Hiperveza',
                    text: 'Stvaranje hiperveze od oznaÄ?enog teksta.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                sourceedit : {
                    title: 'UreÄ‘ivanje izvornog koda',
                    text: 'Prebacivanje u naÄ?in rada za ureÄ‘ivanje izvornog koda.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                }
            }
        });
    }

    if(Ext.grid.header.Container){
        Ext.apply(Ext.grid.header.Container.prototype, {
            sortAscText  : "Sortiraj rastuÄ‡im redoslijedom",
            sortDescText : "Sortiraj padajuÄ‡im redoslijedom",
            lockText     : "ZakljuÄ?aj stupac",
            unlockText   : "OtkljuÄ?aj stupac",
            columnsText  : "Stupci"
        });
    }

    if(Ext.grid.GroupingFeature){
        Ext.apply(Ext.grid.GroupingFeature.prototype, {
            emptyGroupText : '(NiÅ¡ta)',
            groupByText    : 'Grupiranje po ovom polju',
            showGroupsText : 'Prikaz u grupama'
        });
    }

    if(Ext.grid.PropertyColumnModel){
        Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
            nameText   : "Naziv",
            valueText  : "Vrijednost",
            dateFormat : "d.m.Y"
        });
    }

    if(Ext.layout.BorderLayout &&Ext.layout.BorderLayout.SplitRegion){
        Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
            splitTip            : "Povuci za promjenu veliÄ?ine.",
            collapsibleSplitTip : "Povuci za promjenu veliÄ?ine. Dvostruki klik za skrivanje."
        });
    }
});
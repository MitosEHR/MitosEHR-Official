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
 * Serbian Latin Translation
 * by Atila Hajnal (latin, utf8 encoding)
 * sr
 * 14 Sep 2007
 */
Ext.onReady(function() {
    if(Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">U�?itavam...</div>';
    }

    if(Ext.view.View){
       Ext.view.View.prototype.emptyText = "Ne postoji ni jedan slog";
    }

    if(Ext.grid.Panel){
       Ext.grid.Panel.prototype.ddText = "{0} izabranih redova";
    }

    if(Ext.TabPanelItem){
       Ext.TabPanelItem.prototype.closeText = "Zatvori оvu »karticu«";
    }

    if(Ext.form.field.Base){
       Ext.form.field.Base.prototype.invalidText = "Unešena vrednost nije pravilna";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "U�?itavam...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
           "Januar",
           "Februar",
           "Mart",
           "April",
           "Мај",
           "Jun",
           "Јul",
           "Avgust",
           "Septembar",
           "Oktobar",
           "Novembar",
           "Decembar"
        ];

        Ext.Date.dayNames = [
           "Nedelja",
           "Ponedeljak",
           "Utorak",
           "Sreda",
           "Četvrtak",
           "Petak",
           "Subota"
        ];
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
            currencySign: '\u0414\u0438\u043d\u002e',  // Serbian Dinar
            dateFormat: 'd.m.Y'
        });
    }

    if(Ext.picker.Date){
       Ext.apply(Ext.picker.Date.prototype, {
          todayText         : "Danas",
          minText           : "Datum је ispred najmanjeg dozvoljenog datuma",
          maxText           : "Datum је nakon najvećeg dozvoljenog datuma",
          disabledDaysText  : "",
          disabledDatesText : "",
          monthNames	: Ext.Date.monthNames,
          dayNames		: Ext.Date.dayNames,
          nextText          : 'Sledeći mesec (Control+Desno)',
          prevText          : 'Prethodni mesec (Control+Levo)',
          monthYearText     : 'Izaberite mesec (Control+Gore/Dole za izbor godine)',
          todayTip          : "{0} (Razmaknica)",
          format            : "d.m.y",
          startDay 		 : 1
       });
    }

    if(Ext.toolbar.Paging){
       Ext.apply(Ext.PagingToolbar.prototype, {
          beforePageText : "Strana",
          afterPageText  : "od {0}",
          firstText      : "Prva strana",
          prevText       : "Prethodna strana",
          nextText       : "Sledeća strana",
          lastText       : "Poslednja strana",
          refreshText    : "Osveži",
          displayMsg     : "Prikazana {0} - {1} od {2}",
          emptyMsg       : 'Nemam šta prikazati'
       });
    }

    if(Ext.form.field.Text){
       Ext.apply(Ext.form.field.Text.prototype, {
          minLengthText : "Minimalna dužina ovog polja је {0}",
          maxLengthText : "Maksimalna dužina ovog polja је {0}",
          blankText     : "Polje је obavezno",
          regexText     : "",
          emptyText     : null
       });
    }

    if(Ext.form.field.Number){
       Ext.apply(Ext.form.field.Number.prototype, {
          minText : "Minimalna vrednost u polju је {0}",
          maxText : "Maksimalna vrednost u polju је {0}",
          nanText : "{0} nije pravilan broj"
       });
    }

    if(Ext.form.field.Date){
       Ext.apply(Ext.form.field.Date.prototype, {
          disabledDaysText  : "Pasivno",
          disabledDatesText : "Pasivno",
          minText           : "Datum u ovom polju mora biti nakon {0}",
          maxText           : "Datum u ovom polju mora biti pre {0}",
          invalidText       : "{0} nije pravilan datum - zahtevani oblik je {1}",
          format            : "d.m.y",
          altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
       });
    }

    if(Ext.form.field.ComboBox){
       Ext.apply(Ext.form.field.ComboBox.prototype, {
          loadingText       : "U�?itavam...",
          valueNotFoundText : undefined
       });
    }

    if(Ext.form.field.VTypes){
       Ext.apply(Ext.form.field.VTypes, {
          emailText    : 'Ovo polje prihavata e-mail adresu isklju�?ivo u obliku "korisnik@domen.com"',
          urlText      : 'Ovo polje prihavata URL adresu isklju�?ivo u obliku "http:/'+'/www.domen.com"',
          alphaText    : 'Ovo polje može sadržati isklju�?ivo slova i znak _',
          alphanumText : 'Ovo polje može sadržati �?амо slova, brojeve i znak _'
       });
    }

    if(Ext.grid.header.Container){
       Ext.apply(Ext.grid.header.Container.prototype, {
          sortAscText  : "Rastući redosled",
          sortDescText : "Opadajući redosled",
          lockText     : "Zaklju�?aj kolonu",
          unlockText   : "Otklju�?aj kolonu",
          columnsText  : "Kolone"
       });
    }

    if(Ext.grid.PropertyColumnModel){
       Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
          nameText   : "Naziv",
          valueText  : "Vrednost",
          dateFormat : "d.m.Y"
       });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
       Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
          splitTip            : "Povući za izmenu veli�?ine.",
          collapsibleSplitTip : "Povući za izmenu veli�?ine. Dvostruku klik za sakrivanje."
       });
    }
});
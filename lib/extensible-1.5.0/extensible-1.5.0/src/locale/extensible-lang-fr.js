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
/*
 * French (France) locale
 * Contributors: devil1591, Alain Deseine, Yannick Torres
 */

Extensible.Date.use24HourTime = true;

if(Extensible.calendar.view.AbstractCalendar) {
    Ext.apply(Extensible.calendar.view.AbstractCalendar.prototype, {
        startDay: 1,
        todayText: 'Aujourd\'hui',
        defaultEventTitleText: '(Pas de titre)',
        ddCreateEventText: 'Créer évènement le {0}',
        ddMoveEventText: 'Déplacer évènement le {0}',
        ddResizeEventText: 'Mettre à jour l\'événement au {0}'
    });
}

if(Extensible.calendar.view.Month) {
    Ext.apply(Extensible.calendar.view.Month.prototype, {
        moreText: '+{0} autres ...',
        getMoreText: function(numEvents){
            return '+{0} autres ...';
        },
        detailsTitleDateFormat: 'd F'
    });
}

if(Extensible.calendar.CalendarPanel) {
    Ext.apply(Extensible.calendar.CalendarPanel.prototype, {
        todayText: 'Aujourd\'hui',
        dayText: 'Jour',
        weekText: 'Semaine',
        monthText: 'Mois',
        jumpToText: 'Aller au :',
        goText: 'Ok',
        multiDayText: '{0} jours',
        multiWeekText: '{0} semaines',
        getMultiDayText: function(numDays){
            return '{0} jours';
        },
        getMultiWeekText: function(numWeeks){
            return '{0} semaines';
        }
    });
}

if(Extensible.calendar.form.EventWindow) {
    Ext.apply(Extensible.calendar.form.EventWindow.prototype, {
        width: 650,
        labelWidth: 65,
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        savingMessage: 'Sauvegarde des changements...',
        deletingMessage: 'Suppression de l\'évènement...',
        detailsLinkText: 'Détail de l\'événement...',
        saveButtonText: 'Enregistrer',
        deleteButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        titleLabelText: 'Titre',
        datesLabelText: 'Quand',
        calendarLabelText: 'Agenda'
    });
}

if(Extensible.calendar.form.EventDetails) {
    Ext.apply(Extensible.calendar.form.EventDetails.prototype, {
        labelWidth: 55,
        labelWidthRightCol: 80,
        title: 'Formulaire évènement',
        titleTextAdd: 'Ajouter évènement',
        titleTextEdit: 'Editer évènement',
        saveButtonText: 'Enregistrer',
        deleteButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        titleLabelText: 'Titre',
        datesLabelText: 'Quand',
        reminderLabelText: 'Rappel',
        notesLabelText: 'Notes',
        locationLabelText: 'Lieu',
        webLinkLabelText: 'Lien internet',
        calendarLabelText: 'Agenda',
        repeatsLabelText: 'Répéter'
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        toText: 'au',
        allDayText: 'Toute la journée'
    });
}

if(Extensible.calendar.form.field.CalendarCombo) {
    Ext.apply(Extensible.calendar.form.field.CalendarCombo.prototype, {
        fieldLabel: 'Agenda'
    });
}

if(Extensible.calendar.gadget.CalendarListPanel) {
    Ext.apply(Extensible.calendar.gadget.CalendarListPanel.prototype, {
        title: 'Agendas'
    });
}

if(Extensible.calendar.gadget.CalendarListMenu) {
    Ext.apply(Extensible.calendar.gadget.CalendarListMenu.prototype, {
        displayOnlyThisCalendarText: 'N\'afficher que cet agenda'
    });
}

if(Extensible.form.recurrence.Combo) {
    Ext.apply(Extensible.form.recurrence.Combo.prototype, {
        fieldLabel: 'Réccurence',
        recurrenceText: {
            none: 'Ne pas répéter',
            daily: 'Quotidien',
            weekly: 'Hebdomadaire',
            monthly: 'Mensuel',
            yearly: 'Annuel'
        }
    });
}

if(Extensible.calendar.form.field.ReminderCombo) {
    Ext.apply(Extensible.calendar.form.field.ReminderCombo.prototype, {
        fieldLabel: 'Rappel',
        noneText: 'Aucun',
        atStartTimeText: 'au début',
        getMinutesText: function(numMinutes){
            return numMinutes === 1 ? 'minute' : 'minutes';
        },
        getHoursText: function(numHours){
            return numHours === 1 ? 'heure' : 'heures';
        },
        getDaysText: function(numDays){
            return numDays === 1 ? 'jour' : 'jours';
        },
        getWeeksText: function(numWeeks){
            return numWeeks === 1 ? 'semaine' : 'semaines';
        },
        reminderValueFormat: '{0} {1} avant le début' // e.g. "2 hours before start"
    });
}

if(Extensible.form.field.DateRange) {
    Ext.apply(Extensible.form.field.DateRange.prototype, {
        dateFormat: 'd/m/Y'
    });
}

if(Extensible.calendar.menu.Event) {
    Ext.apply(Extensible.calendar.menu.Event.prototype, {
        editDetailsText: 'Éditer les détails',
        deleteText: 'Effacer',
        moveToText: 'Déplacer au...'
    });
}

if(Extensible.calendar.dd.DropZone) {
    Ext.apply(Extensible.calendar.dd.DropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat: 'd/m'
    });
}

if(Extensible.calendar.dd.DayDropZone) {
    Ext.apply(Extensible.calendar.dd.DayDropZone.prototype, {
        dateRangeFormat: '{0}-{1}',
        dateFormat : 'd/m'
    });
}

if(Extensible.calendar.template.BoxLayout) {
    Ext.apply(Extensible.calendar.template.BoxLayout.prototype, {
        firstWeekDateFormat: 'D d',
        otherWeeksDateFormat: 'd',
        singleDayDateFormat: 'l d F Y',
        multiDayFirstDayFormat: 'd M Y',
        multiDayMonthStartFormat: 'd M'
    });
}

if(Extensible.calendar.template.Month) {
    Ext.apply(Extensible.calendar.template.Month.prototype, {
        dayHeaderFormat: 'D',
        dayHeaderTitleFormat: 'l d F Y'
    });
}

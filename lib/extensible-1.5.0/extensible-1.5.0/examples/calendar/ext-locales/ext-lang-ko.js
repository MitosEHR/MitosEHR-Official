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
 * Korean Translations By nicetip
 * 05 September 2007
 * Modify by techbug / 25 February 2008
 */
Ext.onReady(function() {
    if(Ext.Updater){
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">로딩중...</div>';
    }

    if(Ext.view.View){
        Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
        Ext.grid.Panel.prototype.ddText = "{0} 개가 선�?�?�었습니다.";
    }

    if(Ext.TabPanelItem){
        Ext.TabPanelItem.prototype.closeText = "닫기";
    }

    if(Ext.form.field.Base){
        Ext.form.field.Base.prototype.invalidText = "올바른 값�?� 아닙니다.";
    }

    if(Ext.LoadMask){
        Ext.LoadMask.prototype.msg = "로딩중...";
    }

    if(Ext.Date) {
        Ext.Date.monthNames = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월"
        ];

        Ext.Date.dayNames = [
        "�?�",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토"
        ];
    }
    if(Ext.MessageBox){
        Ext.MessageBox.buttonText = {
            ok     : "확�?�",
            cancel : "취소",
            yes    : "예",
            no     : "아니오"
        };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u20a9',  // Korean Won
            dateFormat: 'm/d/Y'
        });
    }

    if(Ext.picker.Date){
        Ext.apply(Ext.picker.Date.prototype, {
            todayText         : "오늘",
            minText           : "최소 날짜범위를 넘었습니다.",
            maxText           : "최대 날짜범위를 넘었습니다.",
            disabledDaysText  : "",
            disabledDatesText : "",
            monthNames        : Ext.Date.monthNames,
            dayNames          : Ext.Date.dayNames,
            nextText          : '다�?�달(컨트롤키+오른쪽 화살표)',
            prevText          : '�?�전달 (컨트롤키+왼족 화살표)',
            monthYearText     : '월�?� 선�?해주세요. (컨트롤키+위/아래 화살표)',
            todayTip          : "{0} (스페�?�스바)",
            format            : "m/d/y",
            startDay          : 0
        });
    }

    if(Ext.picker.Month) {
        Ext.apply(Ext.picker.Month.prototype, {
            okText            : "확�?�",
            cancelText        : "취소"
        });
    }

    if(Ext.toolbar.Paging){
        Ext.apply(Ext.PagingToolbar.prototype, {
            beforePageText : "페�?�지",
            afterPageText  : "/ {0}",
            firstText      : "첫 페�?�지",
            prevText       : "�?�전 페�?�지",
            nextText       : "다�?� 페�?�지",
            lastText       : "마지막 페�?�지",
            refreshText    : "새로고침",
            displayMsg     : "전체 {2} 중 {0} - {1}",
            emptyMsg       : '표시할 �?��?�터가 없습니다.'
        });
    }

    if(Ext.form.field.Text){
        Ext.apply(Ext.form.field.Text.prototype, {
            minLengthText : "최소길�?�는 {0}입니다.",
            maxLengthText : "최대길�?�는 {0}입니다.",
            blankText     : "값�?� 입력해주세요.",
            regexText     : "",
            emptyText     : null
        });
    }

    if(Ext.form.field.Number){
        Ext.apply(Ext.form.field.Number.prototype, {
            minText : "최소값�?� {0}입니다.",
            maxText : "최대값�?� {0}입니다.",
            nanText : "{0}는 올바른 숫�?가 아닙니다."
        });
    }

    if(Ext.form.field.Date){
        Ext.apply(Ext.form.field.Date.prototype, {
            disabledDaysText  : "비활성",
            disabledDatesText : "비활성",
            minText           : "{0}�?� �?�후여야 합니다.",
            maxText           : "{0}�?� �?�전�?�어야 합니다.",
            invalidText       : "{0}는 올바른 날짜형�?�?� 아닙니다. - 다�?�과 같�?� 형�?�?�어야 합니다. {1}",
            format            : "m/d/y"
        });
    }

    if(Ext.form.field.ComboBox){
        Ext.apply(Ext.form.field.ComboBox.prototype, {
            loadingText       : "로딩중...",
            valueNotFoundText : undefined
        });
    }

    if(Ext.form.field.VTypes){
        Ext.apply(Ext.form.field.VTypes, {
            emailText    : '�?�메�?� 주소 형�?�? 맞게 입력해야합니다. (예: "user@example.com")',
            urlText      : 'URL 형�?�? 맞게 입력해야합니다. (예: "http:/'+'/www.example.com")',
            alphaText    : '�?문, 밑줄(_)만 입력할 수 있습니다.',
            alphanumText : '�?문, 숫�?, 밑줄(_)만 입력할 수 있습니다.'
        });
    }

    if(Ext.form.field.HtmlEditor){
        Ext.apply(Ext.form.field.HtmlEditor.prototype, {
            createLinkText : 'URL�?� 입력해주세요:',
            buttonTips : {
                bold : {
                    title: '굵게 (Ctrl+B)',
                    text: '선�?한 �?스트를 굵게 표시합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic : {
                    title: '기울임꼴 (Ctrl+I)',
                    text: '선�?한 �?스트를 기울임꼴로 표시합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline : {
                    title: '밑줄 (Ctrl+U)',
                    text: '선�?한 �?스트�? 밑줄�?� 표시합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                increasefontsize : {
                    title: '글꼴�?�기 늘림',
                    text: '글꼴 �?�기를 �?�게 합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                decreasefontsize : {
                    title: '글꼴�?�기 줄임',
                    text: '글꼴 �?�기를 작게 합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                backcolor : {
                    title: '�?스트 강조 색',
                    text: '선�?한 �?스트�?� 배경색�?� 변경합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                forecolor : {
                    title: '글꼴색',
                    text: '선�?한 �?스트�?� 색�?� 변경합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyleft : {
                    title: '�?스트 왼쪽 맞춤',
                    text: '왼쪽�? �?스트를 맞춥니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifycenter : {
                    title: '가운�?� 맞춤',
                    text: '가운�?��? �?스트를 맞춥니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyright : {
                    title: '�?스트 오른쪽 맞춤',
                    text: '오른쪽�? �?스트를 맞춥니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertunorderedlist : {
                    title: '글머리 기호',
                    text: '글머리 기호 목�?�?� 시작합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertorderedlist : {
                    title: '번호 매기기',
                    text: '번호 매기기 목�?�?� 시작합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                createlink : {
                    title: '하�?��?��?�?�',
                    text: '선�?한 �?스트�? 하�?��?��?�?�를 만듭니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                sourceedit : {
                    title: '소스편집',
                    text: '소스편집 모드로 변환합니다.',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                }
            }
        });
    }

    if(Ext.grid.header.Container){
        Ext.apply(Ext.grid.header.Container.prototype, {
            sortAscText  : "오름차순 정렬",
            sortDescText : "내림차순 정렬",
            lockText     : "칼럼 잠금",
            unlockText   : "칼럼 잠금해제",
            columnsText  : "칼럼 목�?"
        });
    }

    if(Ext.grid.GroupingFeature){
        Ext.apply(Ext.grid.GroupingFeature.prototype, {
            emptyGroupText : '(None)',
            groupByText    : '현재 필드로 그룹핑합니다.',
            showGroupsText : '그룹으로 보여주기'

        });
    }

    if(Ext.grid.PropertyColumnModel){
        Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
            nameText   : "항목",
            valueText  : "값",
            dateFormat : "m/j/Y"
        });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
        Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
            splitTip            : "�?�기변경�?� 위해 드래그하세요.",
            collapsibleSplitTip : "�?�기변경�?� 위해 드래그, 숨기기 위해 �?�블�?�릭 하세요."
        });
    }

});

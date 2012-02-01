/**
 *
 */
Ext.define('Ext.AbstractComponent', {
    extend: 'Ext.EventedBase',

    onClassExtended: function(Class, members) {
        if (!members.hasOwnProperty('cachedConfig')) {
            return;
        }

        var prototype = Class.prototype,
            config = members.config,
            cachedConfig = members.cachedConfig,
            cachedConfigList = prototype.cachedConfigList,
            hasCachedConfig = prototype.hasCachedConfig,
            name, value;

        delete members.cachedConfig;

        prototype.cachedConfigList = cachedConfigList = (cachedConfigList) ? cachedConfigList.slice() : [],
        prototype.hasCachedConfig = hasCachedConfig = (hasCachedConfig) ? Ext.Object.chain(hasCachedConfig) : {};

        if (!config) {
            members.config = config = {};
        }

        for (name in cachedConfig) {
            if (cachedConfig.hasOwnProperty(name)) {
                value = cachedConfig[name];

                if (!hasCachedConfig[name]) {
                    hasCachedConfig[name] = true;
                    cachedConfigList.push(name);
                }

                config[name] = value;
            }
        }
    },

    initialized: false,

    constructor: function(config) {
        var prototype = this.self.prototype,
            configNameCache, defaultConfig, cachedConfigList, initConfigList, hasInitConfigMap,
            referenceList, reference, renderTemplate, renderElement, elements,
            i, ln, element, name, nameMap, initializedName, internalName;

        this.initialConfig = config;

        this.initElement();

        // This happens only *once* per class, during the very first instantiation
        if (!prototype.hasOwnProperty('renderTemplate')) {
            referenceList = this.referenceList;
            configNameCache = Ext.Class.configNameCache;
            defaultConfig = this.config;
            cachedConfigList = this.cachedConfigList;
            initConfigList = this.initConfigList;
            hasInitConfigMap = this.hasInitConfigMap;

            for (i = 0,ln = cachedConfigList.length; i < ln; i++) {
                name = cachedConfigList[i];
                nameMap = configNameCache[name];
                initializedName = nameMap.initialized;

                prototype[initializedName] = true;

                if (hasInitConfigMap[name]) {
                    delete hasInitConfigMap[name];
                    Ext.Array.remove(initConfigList, name);
                }

                if (defaultConfig[name] !== null) {
                    internalName = nameMap.internal;
                    this[internalName] = null;
                    this[nameMap.set](defaultConfig[name]);
                    prototype[internalName] = this[internalName];
                }
            }

            renderElement = this.renderElement.dom;
            prototype.renderTemplate = renderTemplate = document.createDocumentFragment();
            renderTemplate.appendChild(renderElement.cloneNode(true));

            elements = renderTemplate.querySelectorAll('[id]');

            for (i = 0,ln = elements.length; i < ln; i++) {
                element = elements[i];
                element.removeAttribute('id');
            }

            for (i = 0,ln = referenceList.length; i < ln; i++) {
                reference = referenceList[i];
                this[reference].dom.removeAttribute('reference');
            }
        }

        this.initialize();
    },

    initialize: function() {
        this.initConfig(this.initialConfig);
        this.initialized = true;
    },

    getElementConfig: Ext.emptyFn,

    referenceAttributeName: 'reference',

    referenceSelector: '[reference]',

    /**
     * @private
     * Significantly improve instantiation time for Component with multiple references
     * Ext.Element instance of the reference domNode is only created the very first time
     * it's ever used
     */
    addReferenceNode: function(name, domNode) {
        Ext.Object.redefineProperty(this, name,
            function() {
                var reference;

                delete this[name];
                this[name] = reference = new Ext.Element(domNode);
                return reference;
            }
        );
    },

    initElement: function() {
        var id = this.getId(),
            referenceList = [],
            cleanAttributes = true,
            referenceAttributeName = this.referenceAttributeName,
            renderTemplate, renderElement, element,
            referenceNodes, i, ln, referenceNode, reference;

        if (this.self.prototype.hasOwnProperty('renderTemplate')) {
            renderTemplate = this.renderTemplate.cloneNode(true);
            renderElement = renderTemplate.firstChild;
        }
        else {
            cleanAttributes = false,
            renderTemplate = document.createDocumentFragment();
            renderElement = Ext.Element.create(this.getElementConfig(), true);
            renderTemplate.appendChild(renderElement);
        }

        referenceNodes = renderTemplate.querySelectorAll(this.referenceSelector);

        for (i = 0,ln = referenceNodes.length; i < ln; i++) {
            referenceNode = referenceNodes[i];
            reference = referenceNode.getAttribute(referenceAttributeName);

            if (cleanAttributes) {
                referenceNode.removeAttribute(referenceAttributeName);
            }

            if (reference == 'element') {
                referenceNode.id = id;
                this.element = element = new Ext.Element(referenceNode);
            }
            else {
                this.addReferenceNode(reference, referenceNode);
            }

            referenceList.push(reference);
        }

        this.referenceList = referenceList;

        if (!this.innerElement) {
            this.innerElement = element;
        }

        if (renderElement === element.dom) {
            this.renderElement = element;
        }
        else {
            this.addReferenceNode('renderElement', renderElement);
        }

        return this;
    }
});

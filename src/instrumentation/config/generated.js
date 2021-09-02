/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.hypertrace = (function() {
    
        /**
         * Namespace hypertrace.
         * @exports hypertrace
         * @namespace
         */
        var hypertrace = {};
    
        hypertrace.agent = (function() {
    
            /**
             * Namespace agent.
             * @memberof hypertrace
             * @namespace
             */
            var agent = {};
    
            agent.config = (function() {
    
                /**
                 * Namespace config.
                 * @memberof hypertrace.agent
                 * @namespace
                 */
                var config = {};
    
                config.v1 = (function() {
    
                    /**
                     * Namespace v1.
                     * @memberof hypertrace.agent.config
                     * @namespace
                     */
                    var v1 = {};
    
                    v1.AgentConfig = (function() {
    
                        /**
                         * Properties of an AgentConfig.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IAgentConfig
                         * @property {google.protobuf.IStringValue|null} [service_name] AgentConfig service_name
                         * @property {hypertrace.agent.config.v1.IReporting|null} [reporting] AgentConfig reporting
                         * @property {hypertrace.agent.config.v1.IDataCapture|null} [data_capture] AgentConfig data_capture
                         * @property {Array.<hypertrace.agent.config.v1.PropagationFormat>|null} [propagation_formats] AgentConfig propagation_formats
                         * @property {google.protobuf.IBoolValue|null} [enabled] AgentConfig enabled
                         * @property {hypertrace.agent.config.v1.IJavaAgent|null} [javaagent] AgentConfig javaagent
                         * @property {Object.<string,string>|null} [resource_attributes] AgentConfig resource_attributes
                         */
    
                        /**
                         * Constructs a new AgentConfig.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents an AgentConfig.
                         * @implements IAgentConfig
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IAgentConfig=} [properties] Properties to set
                         */
                        function AgentConfig(properties) {
                            this.propagation_formats = [];
                            this.resource_attributes = {};
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * AgentConfig service_name.
                         * @member {google.protobuf.IStringValue|null|undefined} service_name
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.service_name = null;
    
                        /**
                         * AgentConfig reporting.
                         * @member {hypertrace.agent.config.v1.IReporting|null|undefined} reporting
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.reporting = null;
    
                        /**
                         * AgentConfig data_capture.
                         * @member {hypertrace.agent.config.v1.IDataCapture|null|undefined} data_capture
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.data_capture = null;
    
                        /**
                         * AgentConfig propagation_formats.
                         * @member {Array.<hypertrace.agent.config.v1.PropagationFormat>} propagation_formats
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.propagation_formats = $util.emptyArray;
    
                        /**
                         * AgentConfig enabled.
                         * @member {google.protobuf.IBoolValue|null|undefined} enabled
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.enabled = null;
    
                        /**
                         * AgentConfig javaagent.
                         * @member {hypertrace.agent.config.v1.IJavaAgent|null|undefined} javaagent
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.javaagent = null;
    
                        /**
                         * AgentConfig resource_attributes.
                         * @member {Object.<string,string>} resource_attributes
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         */
                        AgentConfig.prototype.resource_attributes = $util.emptyObject;
    
                        /**
                         * Creates a new AgentConfig instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {hypertrace.agent.config.v1.IAgentConfig=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.AgentConfig} AgentConfig instance
                         */
                        AgentConfig.create = function create(properties) {
                            return new AgentConfig(properties);
                        };
    
                        /**
                         * Encodes the specified AgentConfig message. Does not implicitly {@link hypertrace.agent.config.v1.AgentConfig.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {hypertrace.agent.config.v1.IAgentConfig} message AgentConfig message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        AgentConfig.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.service_name != null && Object.hasOwnProperty.call(message, "service_name"))
                                $root.google.protobuf.StringValue.encode(message.service_name, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.reporting != null && Object.hasOwnProperty.call(message, "reporting"))
                                $root.hypertrace.agent.config.v1.Reporting.encode(message.reporting, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.data_capture != null && Object.hasOwnProperty.call(message, "data_capture"))
                                $root.hypertrace.agent.config.v1.DataCapture.encode(message.data_capture, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.propagation_formats != null && message.propagation_formats.length) {
                                writer.uint32(/* id 4, wireType 2 =*/34).fork();
                                for (var i = 0; i < message.propagation_formats.length; ++i)
                                    writer.int32(message.propagation_formats[i]);
                                writer.ldelim();
                            }
                            if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                                $root.google.protobuf.BoolValue.encode(message.enabled, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                            if (message.javaagent != null && Object.hasOwnProperty.call(message, "javaagent"))
                                $root.hypertrace.agent.config.v1.JavaAgent.encode(message.javaagent, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                            if (message.resource_attributes != null && Object.hasOwnProperty.call(message, "resource_attributes"))
                                for (var keys = Object.keys(message.resource_attributes), i = 0; i < keys.length; ++i)
                                    writer.uint32(/* id 7, wireType 2 =*/58).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.resource_attributes[keys[i]]).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified AgentConfig message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.AgentConfig.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {hypertrace.agent.config.v1.IAgentConfig} message AgentConfig message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        AgentConfig.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes an AgentConfig message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.AgentConfig} AgentConfig
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        AgentConfig.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.AgentConfig(), key, value;
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.service_name = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                                    break;
                                case 2:
                                    message.reporting = $root.hypertrace.agent.config.v1.Reporting.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.data_capture = $root.hypertrace.agent.config.v1.DataCapture.decode(reader, reader.uint32());
                                    break;
                                case 4:
                                    if (!(message.propagation_formats && message.propagation_formats.length))
                                        message.propagation_formats = [];
                                    if ((tag & 7) === 2) {
                                        var end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.propagation_formats.push(reader.int32());
                                    } else
                                        message.propagation_formats.push(reader.int32());
                                    break;
                                case 5:
                                    message.enabled = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                                    break;
                                case 6:
                                    message.javaagent = $root.hypertrace.agent.config.v1.JavaAgent.decode(reader, reader.uint32());
                                    break;
                                case 7:
                                    if (message.resource_attributes === $util.emptyObject)
                                        message.resource_attributes = {};
                                    var end2 = reader.uint32() + reader.pos;
                                    key = "";
                                    value = "";
                                    while (reader.pos < end2) {
                                        var tag2 = reader.uint32();
                                        switch (tag2 >>> 3) {
                                        case 1:
                                            key = reader.string();
                                            break;
                                        case 2:
                                            value = reader.string();
                                            break;
                                        default:
                                            reader.skipType(tag2 & 7);
                                            break;
                                        }
                                    }
                                    message.resource_attributes[key] = value;
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes an AgentConfig message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.AgentConfig} AgentConfig
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        AgentConfig.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies an AgentConfig message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        AgentConfig.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.service_name != null && message.hasOwnProperty("service_name")) {
                                var error = $root.google.protobuf.StringValue.verify(message.service_name);
                                if (error)
                                    return "service_name." + error;
                            }
                            if (message.reporting != null && message.hasOwnProperty("reporting")) {
                                var error = $root.hypertrace.agent.config.v1.Reporting.verify(message.reporting);
                                if (error)
                                    return "reporting." + error;
                            }
                            if (message.data_capture != null && message.hasOwnProperty("data_capture")) {
                                var error = $root.hypertrace.agent.config.v1.DataCapture.verify(message.data_capture);
                                if (error)
                                    return "data_capture." + error;
                            }
                            if (message.propagation_formats != null && message.hasOwnProperty("propagation_formats")) {
                                if (!Array.isArray(message.propagation_formats))
                                    return "propagation_formats: array expected";
                                for (var i = 0; i < message.propagation_formats.length; ++i)
                                    switch (message.propagation_formats[i]) {
                                    default:
                                        return "propagation_formats: enum value[] expected";
                                    case 0:
                                    case 1:
                                        break;
                                    }
                            }
                            if (message.enabled != null && message.hasOwnProperty("enabled")) {
                                var error = $root.google.protobuf.BoolValue.verify(message.enabled);
                                if (error)
                                    return "enabled." + error;
                            }
                            if (message.javaagent != null && message.hasOwnProperty("javaagent")) {
                                var error = $root.hypertrace.agent.config.v1.JavaAgent.verify(message.javaagent);
                                if (error)
                                    return "javaagent." + error;
                            }
                            if (message.resource_attributes != null && message.hasOwnProperty("resource_attributes")) {
                                if (!$util.isObject(message.resource_attributes))
                                    return "resource_attributes: object expected";
                                var key = Object.keys(message.resource_attributes);
                                for (var i = 0; i < key.length; ++i)
                                    if (!$util.isString(message.resource_attributes[key[i]]))
                                        return "resource_attributes: string{k:string} expected";
                            }
                            return null;
                        };
    
                        /**
                         * Creates an AgentConfig message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.AgentConfig} AgentConfig
                         */
                        AgentConfig.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.AgentConfig)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.AgentConfig();
                            if (object.service_name != null) {
                                if (typeof object.service_name !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.service_name: object expected");
                                message.service_name = $root.google.protobuf.StringValue.fromObject(object.service_name);
                            }
                            if (object.reporting != null) {
                                if (typeof object.reporting !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.reporting: object expected");
                                message.reporting = $root.hypertrace.agent.config.v1.Reporting.fromObject(object.reporting);
                            }
                            if (object.data_capture != null) {
                                if (typeof object.data_capture !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.data_capture: object expected");
                                message.data_capture = $root.hypertrace.agent.config.v1.DataCapture.fromObject(object.data_capture);
                            }
                            if (object.propagation_formats) {
                                if (!Array.isArray(object.propagation_formats))
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.propagation_formats: array expected");
                                message.propagation_formats = [];
                                for (var i = 0; i < object.propagation_formats.length; ++i)
                                    switch (object.propagation_formats[i]) {
                                    default:
                                    case "B3":
                                    case 0:
                                        message.propagation_formats[i] = 0;
                                        break;
                                    case "TRACECONTEXT":
                                    case 1:
                                        message.propagation_formats[i] = 1;
                                        break;
                                    }
                            }
                            if (object.enabled != null) {
                                if (typeof object.enabled !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.enabled: object expected");
                                message.enabled = $root.google.protobuf.BoolValue.fromObject(object.enabled);
                            }
                            if (object.javaagent != null) {
                                if (typeof object.javaagent !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.javaagent: object expected");
                                message.javaagent = $root.hypertrace.agent.config.v1.JavaAgent.fromObject(object.javaagent);
                            }
                            if (object.resource_attributes) {
                                if (typeof object.resource_attributes !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.AgentConfig.resource_attributes: object expected");
                                message.resource_attributes = {};
                                for (var keys = Object.keys(object.resource_attributes), i = 0; i < keys.length; ++i)
                                    message.resource_attributes[keys[i]] = String(object.resource_attributes[keys[i]]);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from an AgentConfig message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @static
                         * @param {hypertrace.agent.config.v1.AgentConfig} message AgentConfig
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        AgentConfig.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.arrays || options.defaults)
                                object.propagation_formats = [];
                            if (options.objects || options.defaults)
                                object.resource_attributes = {};
                            if (options.defaults) {
                                object.service_name = null;
                                object.reporting = null;
                                object.data_capture = null;
                                object.enabled = null;
                                object.javaagent = null;
                            }
                            if (message.service_name != null && message.hasOwnProperty("service_name"))
                                object.service_name = $root.google.protobuf.StringValue.toObject(message.service_name, options);
                            if (message.reporting != null && message.hasOwnProperty("reporting"))
                                object.reporting = $root.hypertrace.agent.config.v1.Reporting.toObject(message.reporting, options);
                            if (message.data_capture != null && message.hasOwnProperty("data_capture"))
                                object.data_capture = $root.hypertrace.agent.config.v1.DataCapture.toObject(message.data_capture, options);
                            if (message.propagation_formats && message.propagation_formats.length) {
                                object.propagation_formats = [];
                                for (var j = 0; j < message.propagation_formats.length; ++j)
                                    object.propagation_formats[j] = options.enums === String ? $root.hypertrace.agent.config.v1.PropagationFormat[message.propagation_formats[j]] : message.propagation_formats[j];
                            }
                            if (message.enabled != null && message.hasOwnProperty("enabled"))
                                object.enabled = $root.google.protobuf.BoolValue.toObject(message.enabled, options);
                            if (message.javaagent != null && message.hasOwnProperty("javaagent"))
                                object.javaagent = $root.hypertrace.agent.config.v1.JavaAgent.toObject(message.javaagent, options);
                            var keys2;
                            if (message.resource_attributes && (keys2 = Object.keys(message.resource_attributes)).length) {
                                object.resource_attributes = {};
                                for (var j = 0; j < keys2.length; ++j)
                                    object.resource_attributes[keys2[j]] = message.resource_attributes[keys2[j]];
                            }
                            return object;
                        };
    
                        /**
                         * Converts this AgentConfig to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.AgentConfig
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        AgentConfig.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return AgentConfig;
                    })();
    
                    v1.Reporting = (function() {
    
                        /**
                         * Properties of a Reporting.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IReporting
                         * @property {google.protobuf.IStringValue|null} [endpoint] Reporting endpoint
                         * @property {google.protobuf.IBoolValue|null} [secure] Reporting secure
                         * @property {google.protobuf.IStringValue|null} [token] Reporting token
                         * @property {hypertrace.agent.config.v1.IOpa|null} [opa] Reporting opa
                         * @property {hypertrace.agent.config.v1.TraceReporterType|null} [trace_reporter_type] Reporting trace_reporter_type
                         */
    
                        /**
                         * Constructs a new Reporting.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents a Reporting.
                         * @implements IReporting
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IReporting=} [properties] Properties to set
                         */
                        function Reporting(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Reporting endpoint.
                         * @member {google.protobuf.IStringValue|null|undefined} endpoint
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         */
                        Reporting.prototype.endpoint = null;
    
                        /**
                         * Reporting secure.
                         * @member {google.protobuf.IBoolValue|null|undefined} secure
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         */
                        Reporting.prototype.secure = null;
    
                        /**
                         * Reporting token.
                         * @member {google.protobuf.IStringValue|null|undefined} token
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         */
                        Reporting.prototype.token = null;
    
                        /**
                         * Reporting opa.
                         * @member {hypertrace.agent.config.v1.IOpa|null|undefined} opa
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         */
                        Reporting.prototype.opa = null;
    
                        /**
                         * Reporting trace_reporter_type.
                         * @member {hypertrace.agent.config.v1.TraceReporterType} trace_reporter_type
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         */
                        Reporting.prototype.trace_reporter_type = 0;
    
                        /**
                         * Creates a new Reporting instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {hypertrace.agent.config.v1.IReporting=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.Reporting} Reporting instance
                         */
                        Reporting.create = function create(properties) {
                            return new Reporting(properties);
                        };
    
                        /**
                         * Encodes the specified Reporting message. Does not implicitly {@link hypertrace.agent.config.v1.Reporting.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {hypertrace.agent.config.v1.IReporting} message Reporting message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Reporting.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.endpoint != null && Object.hasOwnProperty.call(message, "endpoint"))
                                $root.google.protobuf.StringValue.encode(message.endpoint, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.secure != null && Object.hasOwnProperty.call(message, "secure"))
                                $root.google.protobuf.BoolValue.encode(message.secure, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                                $root.google.protobuf.StringValue.encode(message.token, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.opa != null && Object.hasOwnProperty.call(message, "opa"))
                                $root.hypertrace.agent.config.v1.Opa.encode(message.opa, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            if (message.trace_reporter_type != null && Object.hasOwnProperty.call(message, "trace_reporter_type"))
                                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.trace_reporter_type);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Reporting message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Reporting.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {hypertrace.agent.config.v1.IReporting} message Reporting message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Reporting.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Reporting message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.Reporting} Reporting
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Reporting.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.Reporting();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.endpoint = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                                    break;
                                case 2:
                                    message.secure = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.token = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                                    break;
                                case 4:
                                    message.opa = $root.hypertrace.agent.config.v1.Opa.decode(reader, reader.uint32());
                                    break;
                                case 5:
                                    message.trace_reporter_type = reader.int32();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a Reporting message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.Reporting} Reporting
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Reporting.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Reporting message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Reporting.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.endpoint != null && message.hasOwnProperty("endpoint")) {
                                var error = $root.google.protobuf.StringValue.verify(message.endpoint);
                                if (error)
                                    return "endpoint." + error;
                            }
                            if (message.secure != null && message.hasOwnProperty("secure")) {
                                var error = $root.google.protobuf.BoolValue.verify(message.secure);
                                if (error)
                                    return "secure." + error;
                            }
                            if (message.token != null && message.hasOwnProperty("token")) {
                                var error = $root.google.protobuf.StringValue.verify(message.token);
                                if (error)
                                    return "token." + error;
                            }
                            if (message.opa != null && message.hasOwnProperty("opa")) {
                                var error = $root.hypertrace.agent.config.v1.Opa.verify(message.opa);
                                if (error)
                                    return "opa." + error;
                            }
                            if (message.trace_reporter_type != null && message.hasOwnProperty("trace_reporter_type"))
                                switch (message.trace_reporter_type) {
                                default:
                                    return "trace_reporter_type: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                    break;
                                }
                            return null;
                        };
    
                        /**
                         * Creates a Reporting message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.Reporting} Reporting
                         */
                        Reporting.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.Reporting)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.Reporting();
                            if (object.endpoint != null) {
                                if (typeof object.endpoint !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Reporting.endpoint: object expected");
                                message.endpoint = $root.google.protobuf.StringValue.fromObject(object.endpoint);
                            }
                            if (object.secure != null) {
                                if (typeof object.secure !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Reporting.secure: object expected");
                                message.secure = $root.google.protobuf.BoolValue.fromObject(object.secure);
                            }
                            if (object.token != null) {
                                if (typeof object.token !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Reporting.token: object expected");
                                message.token = $root.google.protobuf.StringValue.fromObject(object.token);
                            }
                            if (object.opa != null) {
                                if (typeof object.opa !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Reporting.opa: object expected");
                                message.opa = $root.hypertrace.agent.config.v1.Opa.fromObject(object.opa);
                            }
                            switch (object.trace_reporter_type) {
                            case "UNSPECIFIED":
                            case 0:
                                message.trace_reporter_type = 0;
                                break;
                            case "ZIPKIN":
                            case 1:
                                message.trace_reporter_type = 1;
                                break;
                            case "OTLP":
                            case 2:
                                message.trace_reporter_type = 2;
                                break;
                            case "LOGGING":
                            case 3:
                                message.trace_reporter_type = 3;
                                break;
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Reporting message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @static
                         * @param {hypertrace.agent.config.v1.Reporting} message Reporting
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Reporting.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.endpoint = null;
                                object.secure = null;
                                object.token = null;
                                object.opa = null;
                                object.trace_reporter_type = options.enums === String ? "UNSPECIFIED" : 0;
                            }
                            if (message.endpoint != null && message.hasOwnProperty("endpoint"))
                                object.endpoint = $root.google.protobuf.StringValue.toObject(message.endpoint, options);
                            if (message.secure != null && message.hasOwnProperty("secure"))
                                object.secure = $root.google.protobuf.BoolValue.toObject(message.secure, options);
                            if (message.token != null && message.hasOwnProperty("token"))
                                object.token = $root.google.protobuf.StringValue.toObject(message.token, options);
                            if (message.opa != null && message.hasOwnProperty("opa"))
                                object.opa = $root.hypertrace.agent.config.v1.Opa.toObject(message.opa, options);
                            if (message.trace_reporter_type != null && message.hasOwnProperty("trace_reporter_type"))
                                object.trace_reporter_type = options.enums === String ? $root.hypertrace.agent.config.v1.TraceReporterType[message.trace_reporter_type] : message.trace_reporter_type;
                            return object;
                        };
    
                        /**
                         * Converts this Reporting to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.Reporting
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Reporting.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Reporting;
                    })();
    
                    v1.Opa = (function() {
    
                        /**
                         * Properties of an Opa.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IOpa
                         * @property {google.protobuf.IStringValue|null} [endpoint] Opa endpoint
                         * @property {google.protobuf.IInt32Value|null} [poll_period_seconds] Opa poll_period_seconds
                         * @property {google.protobuf.IBoolValue|null} [enabled] Opa enabled
                         */
    
                        /**
                         * Constructs a new Opa.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents an Opa.
                         * @implements IOpa
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IOpa=} [properties] Properties to set
                         */
                        function Opa(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Opa endpoint.
                         * @member {google.protobuf.IStringValue|null|undefined} endpoint
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @instance
                         */
                        Opa.prototype.endpoint = null;
    
                        /**
                         * Opa poll_period_seconds.
                         * @member {google.protobuf.IInt32Value|null|undefined} poll_period_seconds
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @instance
                         */
                        Opa.prototype.poll_period_seconds = null;
    
                        /**
                         * Opa enabled.
                         * @member {google.protobuf.IBoolValue|null|undefined} enabled
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @instance
                         */
                        Opa.prototype.enabled = null;
    
                        /**
                         * Creates a new Opa instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {hypertrace.agent.config.v1.IOpa=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.Opa} Opa instance
                         */
                        Opa.create = function create(properties) {
                            return new Opa(properties);
                        };
    
                        /**
                         * Encodes the specified Opa message. Does not implicitly {@link hypertrace.agent.config.v1.Opa.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {hypertrace.agent.config.v1.IOpa} message Opa message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Opa.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.endpoint != null && Object.hasOwnProperty.call(message, "endpoint"))
                                $root.google.protobuf.StringValue.encode(message.endpoint, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.poll_period_seconds != null && Object.hasOwnProperty.call(message, "poll_period_seconds"))
                                $root.google.protobuf.Int32Value.encode(message.poll_period_seconds, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                                $root.google.protobuf.BoolValue.encode(message.enabled, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Opa message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Opa.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {hypertrace.agent.config.v1.IOpa} message Opa message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Opa.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes an Opa message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.Opa} Opa
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Opa.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.Opa();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.endpoint = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                                    break;
                                case 2:
                                    message.poll_period_seconds = $root.google.protobuf.Int32Value.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.enabled = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes an Opa message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.Opa} Opa
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Opa.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies an Opa message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Opa.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.endpoint != null && message.hasOwnProperty("endpoint")) {
                                var error = $root.google.protobuf.StringValue.verify(message.endpoint);
                                if (error)
                                    return "endpoint." + error;
                            }
                            if (message.poll_period_seconds != null && message.hasOwnProperty("poll_period_seconds")) {
                                var error = $root.google.protobuf.Int32Value.verify(message.poll_period_seconds);
                                if (error)
                                    return "poll_period_seconds." + error;
                            }
                            if (message.enabled != null && message.hasOwnProperty("enabled")) {
                                var error = $root.google.protobuf.BoolValue.verify(message.enabled);
                                if (error)
                                    return "enabled." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates an Opa message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.Opa} Opa
                         */
                        Opa.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.Opa)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.Opa();
                            if (object.endpoint != null) {
                                if (typeof object.endpoint !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Opa.endpoint: object expected");
                                message.endpoint = $root.google.protobuf.StringValue.fromObject(object.endpoint);
                            }
                            if (object.poll_period_seconds != null) {
                                if (typeof object.poll_period_seconds !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Opa.poll_period_seconds: object expected");
                                message.poll_period_seconds = $root.google.protobuf.Int32Value.fromObject(object.poll_period_seconds);
                            }
                            if (object.enabled != null) {
                                if (typeof object.enabled !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Opa.enabled: object expected");
                                message.enabled = $root.google.protobuf.BoolValue.fromObject(object.enabled);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from an Opa message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @static
                         * @param {hypertrace.agent.config.v1.Opa} message Opa
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Opa.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.endpoint = null;
                                object.poll_period_seconds = null;
                                object.enabled = null;
                            }
                            if (message.endpoint != null && message.hasOwnProperty("endpoint"))
                                object.endpoint = $root.google.protobuf.StringValue.toObject(message.endpoint, options);
                            if (message.poll_period_seconds != null && message.hasOwnProperty("poll_period_seconds"))
                                object.poll_period_seconds = $root.google.protobuf.Int32Value.toObject(message.poll_period_seconds, options);
                            if (message.enabled != null && message.hasOwnProperty("enabled"))
                                object.enabled = $root.google.protobuf.BoolValue.toObject(message.enabled, options);
                            return object;
                        };
    
                        /**
                         * Converts this Opa to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.Opa
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Opa.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Opa;
                    })();
    
                    v1.Message = (function() {
    
                        /**
                         * Properties of a Message.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IMessage
                         * @property {google.protobuf.IBoolValue|null} [request] Message request
                         * @property {google.protobuf.IBoolValue|null} [response] Message response
                         */
    
                        /**
                         * Constructs a new Message.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents a Message.
                         * @implements IMessage
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IMessage=} [properties] Properties to set
                         */
                        function Message(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Message request.
                         * @member {google.protobuf.IBoolValue|null|undefined} request
                         * @memberof hypertrace.agent.config.v1.Message
                         * @instance
                         */
                        Message.prototype.request = null;
    
                        /**
                         * Message response.
                         * @member {google.protobuf.IBoolValue|null|undefined} response
                         * @memberof hypertrace.agent.config.v1.Message
                         * @instance
                         */
                        Message.prototype.response = null;
    
                        /**
                         * Creates a new Message instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {hypertrace.agent.config.v1.IMessage=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.Message} Message instance
                         */
                        Message.create = function create(properties) {
                            return new Message(properties);
                        };
    
                        /**
                         * Encodes the specified Message message. Does not implicitly {@link hypertrace.agent.config.v1.Message.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {hypertrace.agent.config.v1.IMessage} message Message message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Message.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.request != null && Object.hasOwnProperty.call(message, "request"))
                                $root.google.protobuf.BoolValue.encode(message.request, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.response != null && Object.hasOwnProperty.call(message, "response"))
                                $root.google.protobuf.BoolValue.encode(message.response, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Message message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Message.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {hypertrace.agent.config.v1.IMessage} message Message message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Message.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Message message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.Message} Message
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Message.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.Message();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.request = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                                    break;
                                case 2:
                                    message.response = $root.google.protobuf.BoolValue.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a Message message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.Message} Message
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Message.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Message message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Message.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.request != null && message.hasOwnProperty("request")) {
                                var error = $root.google.protobuf.BoolValue.verify(message.request);
                                if (error)
                                    return "request." + error;
                            }
                            if (message.response != null && message.hasOwnProperty("response")) {
                                var error = $root.google.protobuf.BoolValue.verify(message.response);
                                if (error)
                                    return "response." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates a Message message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.Message} Message
                         */
                        Message.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.Message)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.Message();
                            if (object.request != null) {
                                if (typeof object.request !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Message.request: object expected");
                                message.request = $root.google.protobuf.BoolValue.fromObject(object.request);
                            }
                            if (object.response != null) {
                                if (typeof object.response !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.Message.response: object expected");
                                message.response = $root.google.protobuf.BoolValue.fromObject(object.response);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Message message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.Message
                         * @static
                         * @param {hypertrace.agent.config.v1.Message} message Message
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Message.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.request = null;
                                object.response = null;
                            }
                            if (message.request != null && message.hasOwnProperty("request"))
                                object.request = $root.google.protobuf.BoolValue.toObject(message.request, options);
                            if (message.response != null && message.hasOwnProperty("response"))
                                object.response = $root.google.protobuf.BoolValue.toObject(message.response, options);
                            return object;
                        };
    
                        /**
                         * Converts this Message to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.Message
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Message.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Message;
                    })();
    
                    v1.DataCapture = (function() {
    
                        /**
                         * Properties of a DataCapture.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IDataCapture
                         * @property {hypertrace.agent.config.v1.IMessage|null} [http_headers] DataCapture http_headers
                         * @property {hypertrace.agent.config.v1.IMessage|null} [http_body] DataCapture http_body
                         * @property {hypertrace.agent.config.v1.IMessage|null} [rpc_metadata] DataCapture rpc_metadata
                         * @property {hypertrace.agent.config.v1.IMessage|null} [rpc_body] DataCapture rpc_body
                         * @property {google.protobuf.IInt32Value|null} [body_max_size_bytes] DataCapture body_max_size_bytes
                         */
    
                        /**
                         * Constructs a new DataCapture.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents a DataCapture.
                         * @implements IDataCapture
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IDataCapture=} [properties] Properties to set
                         */
                        function DataCapture(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * DataCapture http_headers.
                         * @member {hypertrace.agent.config.v1.IMessage|null|undefined} http_headers
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         */
                        DataCapture.prototype.http_headers = null;
    
                        /**
                         * DataCapture http_body.
                         * @member {hypertrace.agent.config.v1.IMessage|null|undefined} http_body
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         */
                        DataCapture.prototype.http_body = null;
    
                        /**
                         * DataCapture rpc_metadata.
                         * @member {hypertrace.agent.config.v1.IMessage|null|undefined} rpc_metadata
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         */
                        DataCapture.prototype.rpc_metadata = null;
    
                        /**
                         * DataCapture rpc_body.
                         * @member {hypertrace.agent.config.v1.IMessage|null|undefined} rpc_body
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         */
                        DataCapture.prototype.rpc_body = null;
    
                        /**
                         * DataCapture body_max_size_bytes.
                         * @member {google.protobuf.IInt32Value|null|undefined} body_max_size_bytes
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         */
                        DataCapture.prototype.body_max_size_bytes = null;
    
                        /**
                         * Creates a new DataCapture instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {hypertrace.agent.config.v1.IDataCapture=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.DataCapture} DataCapture instance
                         */
                        DataCapture.create = function create(properties) {
                            return new DataCapture(properties);
                        };
    
                        /**
                         * Encodes the specified DataCapture message. Does not implicitly {@link hypertrace.agent.config.v1.DataCapture.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {hypertrace.agent.config.v1.IDataCapture} message DataCapture message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        DataCapture.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.http_headers != null && Object.hasOwnProperty.call(message, "http_headers"))
                                $root.hypertrace.agent.config.v1.Message.encode(message.http_headers, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.http_body != null && Object.hasOwnProperty.call(message, "http_body"))
                                $root.hypertrace.agent.config.v1.Message.encode(message.http_body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.rpc_metadata != null && Object.hasOwnProperty.call(message, "rpc_metadata"))
                                $root.hypertrace.agent.config.v1.Message.encode(message.rpc_metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.rpc_body != null && Object.hasOwnProperty.call(message, "rpc_body"))
                                $root.hypertrace.agent.config.v1.Message.encode(message.rpc_body, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            if (message.body_max_size_bytes != null && Object.hasOwnProperty.call(message, "body_max_size_bytes"))
                                $root.google.protobuf.Int32Value.encode(message.body_max_size_bytes, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified DataCapture message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.DataCapture.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {hypertrace.agent.config.v1.IDataCapture} message DataCapture message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        DataCapture.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a DataCapture message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.DataCapture} DataCapture
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        DataCapture.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.DataCapture();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.http_headers = $root.hypertrace.agent.config.v1.Message.decode(reader, reader.uint32());
                                    break;
                                case 2:
                                    message.http_body = $root.hypertrace.agent.config.v1.Message.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.rpc_metadata = $root.hypertrace.agent.config.v1.Message.decode(reader, reader.uint32());
                                    break;
                                case 4:
                                    message.rpc_body = $root.hypertrace.agent.config.v1.Message.decode(reader, reader.uint32());
                                    break;
                                case 5:
                                    message.body_max_size_bytes = $root.google.protobuf.Int32Value.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a DataCapture message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.DataCapture} DataCapture
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        DataCapture.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a DataCapture message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        DataCapture.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.http_headers != null && message.hasOwnProperty("http_headers")) {
                                var error = $root.hypertrace.agent.config.v1.Message.verify(message.http_headers);
                                if (error)
                                    return "http_headers." + error;
                            }
                            if (message.http_body != null && message.hasOwnProperty("http_body")) {
                                var error = $root.hypertrace.agent.config.v1.Message.verify(message.http_body);
                                if (error)
                                    return "http_body." + error;
                            }
                            if (message.rpc_metadata != null && message.hasOwnProperty("rpc_metadata")) {
                                var error = $root.hypertrace.agent.config.v1.Message.verify(message.rpc_metadata);
                                if (error)
                                    return "rpc_metadata." + error;
                            }
                            if (message.rpc_body != null && message.hasOwnProperty("rpc_body")) {
                                var error = $root.hypertrace.agent.config.v1.Message.verify(message.rpc_body);
                                if (error)
                                    return "rpc_body." + error;
                            }
                            if (message.body_max_size_bytes != null && message.hasOwnProperty("body_max_size_bytes")) {
                                var error = $root.google.protobuf.Int32Value.verify(message.body_max_size_bytes);
                                if (error)
                                    return "body_max_size_bytes." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates a DataCapture message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.DataCapture} DataCapture
                         */
                        DataCapture.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.DataCapture)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.DataCapture();
                            if (object.http_headers != null) {
                                if (typeof object.http_headers !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.DataCapture.http_headers: object expected");
                                message.http_headers = $root.hypertrace.agent.config.v1.Message.fromObject(object.http_headers);
                            }
                            if (object.http_body != null) {
                                if (typeof object.http_body !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.DataCapture.http_body: object expected");
                                message.http_body = $root.hypertrace.agent.config.v1.Message.fromObject(object.http_body);
                            }
                            if (object.rpc_metadata != null) {
                                if (typeof object.rpc_metadata !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.DataCapture.rpc_metadata: object expected");
                                message.rpc_metadata = $root.hypertrace.agent.config.v1.Message.fromObject(object.rpc_metadata);
                            }
                            if (object.rpc_body != null) {
                                if (typeof object.rpc_body !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.DataCapture.rpc_body: object expected");
                                message.rpc_body = $root.hypertrace.agent.config.v1.Message.fromObject(object.rpc_body);
                            }
                            if (object.body_max_size_bytes != null) {
                                if (typeof object.body_max_size_bytes !== "object")
                                    throw TypeError(".hypertrace.agent.config.v1.DataCapture.body_max_size_bytes: object expected");
                                message.body_max_size_bytes = $root.google.protobuf.Int32Value.fromObject(object.body_max_size_bytes);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a DataCapture message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @static
                         * @param {hypertrace.agent.config.v1.DataCapture} message DataCapture
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        DataCapture.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.http_headers = null;
                                object.http_body = null;
                                object.rpc_metadata = null;
                                object.rpc_body = null;
                                object.body_max_size_bytes = null;
                            }
                            if (message.http_headers != null && message.hasOwnProperty("http_headers"))
                                object.http_headers = $root.hypertrace.agent.config.v1.Message.toObject(message.http_headers, options);
                            if (message.http_body != null && message.hasOwnProperty("http_body"))
                                object.http_body = $root.hypertrace.agent.config.v1.Message.toObject(message.http_body, options);
                            if (message.rpc_metadata != null && message.hasOwnProperty("rpc_metadata"))
                                object.rpc_metadata = $root.hypertrace.agent.config.v1.Message.toObject(message.rpc_metadata, options);
                            if (message.rpc_body != null && message.hasOwnProperty("rpc_body"))
                                object.rpc_body = $root.hypertrace.agent.config.v1.Message.toObject(message.rpc_body, options);
                            if (message.body_max_size_bytes != null && message.hasOwnProperty("body_max_size_bytes"))
                                object.body_max_size_bytes = $root.google.protobuf.Int32Value.toObject(message.body_max_size_bytes, options);
                            return object;
                        };
    
                        /**
                         * Converts this DataCapture to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.DataCapture
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        DataCapture.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return DataCapture;
                    })();
    
                    /**
                     * PropagationFormat enum.
                     * @name hypertrace.agent.config.v1.PropagationFormat
                     * @enum {number}
                     * @property {number} B3=0 B3 value
                     * @property {number} TRACECONTEXT=1 TRACECONTEXT value
                     */
                    v1.PropagationFormat = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "B3"] = 0;
                        values[valuesById[1] = "TRACECONTEXT"] = 1;
                        return values;
                    })();
    
                    /**
                     * TraceReporterType enum.
                     * @name hypertrace.agent.config.v1.TraceReporterType
                     * @enum {number}
                     * @property {number} UNSPECIFIED=0 UNSPECIFIED value
                     * @property {number} ZIPKIN=1 ZIPKIN value
                     * @property {number} OTLP=2 OTLP value
                     * @property {number} LOGGING=3 LOGGING value
                     */
                    v1.TraceReporterType = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "UNSPECIFIED"] = 0;
                        values[valuesById[1] = "ZIPKIN"] = 1;
                        values[valuesById[2] = "OTLP"] = 2;
                        values[valuesById[3] = "LOGGING"] = 3;
                        return values;
                    })();
    
                    v1.JavaAgent = (function() {
    
                        /**
                         * Properties of a JavaAgent.
                         * @memberof hypertrace.agent.config.v1
                         * @interface IJavaAgent
                         * @property {Array.<google.protobuf.IStringValue>|null} [filter_jar_paths] JavaAgent filter_jar_paths
                         */
    
                        /**
                         * Constructs a new JavaAgent.
                         * @memberof hypertrace.agent.config.v1
                         * @classdesc Represents a JavaAgent.
                         * @implements IJavaAgent
                         * @constructor
                         * @param {hypertrace.agent.config.v1.IJavaAgent=} [properties] Properties to set
                         */
                        function JavaAgent(properties) {
                            this.filter_jar_paths = [];
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * JavaAgent filter_jar_paths.
                         * @member {Array.<google.protobuf.IStringValue>} filter_jar_paths
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @instance
                         */
                        JavaAgent.prototype.filter_jar_paths = $util.emptyArray;
    
                        /**
                         * Creates a new JavaAgent instance using the specified properties.
                         * @function create
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {hypertrace.agent.config.v1.IJavaAgent=} [properties] Properties to set
                         * @returns {hypertrace.agent.config.v1.JavaAgent} JavaAgent instance
                         */
                        JavaAgent.create = function create(properties) {
                            return new JavaAgent(properties);
                        };
    
                        /**
                         * Encodes the specified JavaAgent message. Does not implicitly {@link hypertrace.agent.config.v1.JavaAgent.verify|verify} messages.
                         * @function encode
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {hypertrace.agent.config.v1.IJavaAgent} message JavaAgent message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        JavaAgent.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.filter_jar_paths != null && message.filter_jar_paths.length)
                                for (var i = 0; i < message.filter_jar_paths.length; ++i)
                                    $root.google.protobuf.StringValue.encode(message.filter_jar_paths[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified JavaAgent message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.JavaAgent.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {hypertrace.agent.config.v1.IJavaAgent} message JavaAgent message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        JavaAgent.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a JavaAgent message from the specified reader or buffer.
                         * @function decode
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {hypertrace.agent.config.v1.JavaAgent} JavaAgent
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        JavaAgent.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hypertrace.agent.config.v1.JavaAgent();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    if (!(message.filter_jar_paths && message.filter_jar_paths.length))
                                        message.filter_jar_paths = [];
                                    message.filter_jar_paths.push($root.google.protobuf.StringValue.decode(reader, reader.uint32()));
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a JavaAgent message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {hypertrace.agent.config.v1.JavaAgent} JavaAgent
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        JavaAgent.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a JavaAgent message.
                         * @function verify
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        JavaAgent.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.filter_jar_paths != null && message.hasOwnProperty("filter_jar_paths")) {
                                if (!Array.isArray(message.filter_jar_paths))
                                    return "filter_jar_paths: array expected";
                                for (var i = 0; i < message.filter_jar_paths.length; ++i) {
                                    var error = $root.google.protobuf.StringValue.verify(message.filter_jar_paths[i]);
                                    if (error)
                                        return "filter_jar_paths." + error;
                                }
                            }
                            return null;
                        };
    
                        /**
                         * Creates a JavaAgent message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {hypertrace.agent.config.v1.JavaAgent} JavaAgent
                         */
                        JavaAgent.fromObject = function fromObject(object) {
                            if (object instanceof $root.hypertrace.agent.config.v1.JavaAgent)
                                return object;
                            var message = new $root.hypertrace.agent.config.v1.JavaAgent();
                            if (object.filter_jar_paths) {
                                if (!Array.isArray(object.filter_jar_paths))
                                    throw TypeError(".hypertrace.agent.config.v1.JavaAgent.filter_jar_paths: array expected");
                                message.filter_jar_paths = [];
                                for (var i = 0; i < object.filter_jar_paths.length; ++i) {
                                    if (typeof object.filter_jar_paths[i] !== "object")
                                        throw TypeError(".hypertrace.agent.config.v1.JavaAgent.filter_jar_paths: object expected");
                                    message.filter_jar_paths[i] = $root.google.protobuf.StringValue.fromObject(object.filter_jar_paths[i]);
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a JavaAgent message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @static
                         * @param {hypertrace.agent.config.v1.JavaAgent} message JavaAgent
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        JavaAgent.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.arrays || options.defaults)
                                object.filter_jar_paths = [];
                            if (message.filter_jar_paths && message.filter_jar_paths.length) {
                                object.filter_jar_paths = [];
                                for (var j = 0; j < message.filter_jar_paths.length; ++j)
                                    object.filter_jar_paths[j] = $root.google.protobuf.StringValue.toObject(message.filter_jar_paths[j], options);
                            }
                            return object;
                        };
    
                        /**
                         * Converts this JavaAgent to JSON.
                         * @function toJSON
                         * @memberof hypertrace.agent.config.v1.JavaAgent
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        JavaAgent.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return JavaAgent;
                    })();
    
                    return v1;
                })();
    
                return config;
            })();
    
            return agent;
        })();
    
        return hypertrace;
    })();
    
    $root.google = (function() {
    
        /**
         * Namespace google.
         * @exports google
         * @namespace
         */
        var google = {};
    
        google.protobuf = (function() {
    
            /**
             * Namespace protobuf.
             * @memberof google
             * @namespace
             */
            var protobuf = {};
    
            protobuf.DoubleValue = (function() {
    
                /**
                 * Properties of a DoubleValue.
                 * @memberof google.protobuf
                 * @interface IDoubleValue
                 * @property {number|null} [value] DoubleValue value
                 */
    
                /**
                 * Constructs a new DoubleValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a DoubleValue.
                 * @implements IDoubleValue
                 * @constructor
                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
                 */
                function DoubleValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * DoubleValue value.
                 * @member {number} value
                 * @memberof google.protobuf.DoubleValue
                 * @instance
                 */
                DoubleValue.prototype.value = 0;
    
                /**
                 * Creates a new DoubleValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
                 * @returns {google.protobuf.DoubleValue} DoubleValue instance
                 */
                DoubleValue.create = function create(properties) {
                    return new DoubleValue(properties);
                };
    
                /**
                 * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DoubleValue.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DoubleValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a DoubleValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.DoubleValue} DoubleValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DoubleValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.double();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.DoubleValue} DoubleValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DoubleValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a DoubleValue message.
                 * @function verify
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DoubleValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value !== "number")
                            return "value: number expected";
                    return null;
                };
    
                /**
                 * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.DoubleValue} DoubleValue
                 */
                DoubleValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.DoubleValue)
                        return object;
                    var message = new $root.google.protobuf.DoubleValue();
                    if (object.value != null)
                        message.value = Number(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.DoubleValue
                 * @static
                 * @param {google.protobuf.DoubleValue} message DoubleValue
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DoubleValue.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                    return object;
                };
    
                /**
                 * Converts this DoubleValue to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.DoubleValue
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DoubleValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return DoubleValue;
            })();
    
            protobuf.FloatValue = (function() {
    
                /**
                 * Properties of a FloatValue.
                 * @memberof google.protobuf
                 * @interface IFloatValue
                 * @property {number|null} [value] FloatValue value
                 */
    
                /**
                 * Constructs a new FloatValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a FloatValue.
                 * @implements IFloatValue
                 * @constructor
                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
                 */
                function FloatValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * FloatValue value.
                 * @member {number} value
                 * @memberof google.protobuf.FloatValue
                 * @instance
                 */
                FloatValue.prototype.value = 0;
    
                /**
                 * Creates a new FloatValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.IFloatValue=} [properties] Properties to set
                 * @returns {google.protobuf.FloatValue} FloatValue instance
                 */
                FloatValue.create = function create(properties) {
                    return new FloatValue(properties);
                };
    
                /**
                 * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FloatValue.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FloatValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a FloatValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.FloatValue} FloatValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.float();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a FloatValue message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.FloatValue} FloatValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a FloatValue message.
                 * @function verify
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FloatValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value !== "number")
                            return "value: number expected";
                    return null;
                };
    
                /**
                 * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.FloatValue} FloatValue
                 */
                FloatValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.FloatValue)
                        return object;
                    var message = new $root.google.protobuf.FloatValue();
                    if (object.value != null)
                        message.value = Number(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.FloatValue
                 * @static
                 * @param {google.protobuf.FloatValue} message FloatValue
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FloatValue.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                    return object;
                };
    
                /**
                 * Converts this FloatValue to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.FloatValue
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FloatValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return FloatValue;
            })();
    
            protobuf.Int64Value = (function() {
    
                /**
                 * Properties of an Int64Value.
                 * @memberof google.protobuf
                 * @interface IInt64Value
                 * @property {number|Long|null} [value] Int64Value value
                 */
    
                /**
                 * Constructs a new Int64Value.
                 * @memberof google.protobuf
                 * @classdesc Represents an Int64Value.
                 * @implements IInt64Value
                 * @constructor
                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
                 */
                function Int64Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Int64Value value.
                 * @member {number|Long} value
                 * @memberof google.protobuf.Int64Value
                 * @instance
                 */
                Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                /**
                 * Creates a new Int64Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.IInt64Value=} [properties] Properties to set
                 * @returns {google.protobuf.Int64Value} Int64Value instance
                 */
                Int64Value.create = function create(properties) {
                    return new Int64Value(properties);
                };
    
                /**
                 * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int64Value.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int64Value.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Int64Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Int64Value} Int64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int64Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an Int64Value message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Int64Value} Int64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int64Value.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Int64Value message.
                 * @function verify
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Int64Value.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                            return "value: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Int64Value} Int64Value
                 */
                Int64Value.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Int64Value)
                        return object;
                    var message = new $root.google.protobuf.Int64Value();
                    if (object.value != null)
                        if ($util.Long)
                            (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                        else if (typeof object.value === "string")
                            message.value = parseInt(object.value, 10);
                        else if (typeof object.value === "number")
                            message.value = object.value;
                        else if (typeof object.value === "object")
                            message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                    return message;
                };
    
                /**
                 * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Int64Value
                 * @static
                 * @param {google.protobuf.Int64Value} message Int64Value
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Int64Value.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.value = options.longs === String ? "0" : 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value === "number")
                            object.value = options.longs === String ? String(message.value) : message.value;
                        else
                            object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                    return object;
                };
    
                /**
                 * Converts this Int64Value to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Int64Value
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Int64Value.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Int64Value;
            })();
    
            protobuf.UInt64Value = (function() {
    
                /**
                 * Properties of a UInt64Value.
                 * @memberof google.protobuf
                 * @interface IUInt64Value
                 * @property {number|Long|null} [value] UInt64Value value
                 */
    
                /**
                 * Constructs a new UInt64Value.
                 * @memberof google.protobuf
                 * @classdesc Represents a UInt64Value.
                 * @implements IUInt64Value
                 * @constructor
                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
                 */
                function UInt64Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * UInt64Value value.
                 * @member {number|Long} value
                 * @memberof google.protobuf.UInt64Value
                 * @instance
                 */
                UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Creates a new UInt64Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
                 * @returns {google.protobuf.UInt64Value} UInt64Value instance
                 */
                UInt64Value.create = function create(properties) {
                    return new UInt64Value(properties);
                };
    
                /**
                 * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt64Value.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt64Value.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a UInt64Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UInt64Value} UInt64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt64Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.uint64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.UInt64Value} UInt64Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt64Value.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a UInt64Value message.
                 * @function verify
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                UInt64Value.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                            return "value: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UInt64Value} UInt64Value
                 */
                UInt64Value.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.UInt64Value)
                        return object;
                    var message = new $root.google.protobuf.UInt64Value();
                    if (object.value != null)
                        if ($util.Long)
                            (message.value = $util.Long.fromValue(object.value)).unsigned = true;
                        else if (typeof object.value === "string")
                            message.value = parseInt(object.value, 10);
                        else if (typeof object.value === "number")
                            message.value = object.value;
                        else if (typeof object.value === "object")
                            message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                    return message;
                };
    
                /**
                 * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.UInt64Value
                 * @static
                 * @param {google.protobuf.UInt64Value} message UInt64Value
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UInt64Value.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.value = options.longs === String ? "0" : 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value === "number")
                            object.value = options.longs === String ? String(message.value) : message.value;
                        else
                            object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                    return object;
                };
    
                /**
                 * Converts this UInt64Value to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.UInt64Value
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                UInt64Value.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return UInt64Value;
            })();
    
            protobuf.Int32Value = (function() {
    
                /**
                 * Properties of an Int32Value.
                 * @memberof google.protobuf
                 * @interface IInt32Value
                 * @property {number|null} [value] Int32Value value
                 */
    
                /**
                 * Constructs a new Int32Value.
                 * @memberof google.protobuf
                 * @classdesc Represents an Int32Value.
                 * @implements IInt32Value
                 * @constructor
                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
                 */
                function Int32Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Int32Value value.
                 * @member {number} value
                 * @memberof google.protobuf.Int32Value
                 * @instance
                 */
                Int32Value.prototype.value = 0;
    
                /**
                 * Creates a new Int32Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.IInt32Value=} [properties] Properties to set
                 * @returns {google.protobuf.Int32Value} Int32Value instance
                 */
                Int32Value.create = function create(properties) {
                    return new Int32Value(properties);
                };
    
                /**
                 * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int32Value.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Int32Value.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Int32Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.Int32Value} Int32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int32Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an Int32Value message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.Int32Value} Int32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Int32Value.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Int32Value message.
                 * @function verify
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Int32Value.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isInteger(message.value))
                            return "value: integer expected";
                    return null;
                };
    
                /**
                 * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.Int32Value} Int32Value
                 */
                Int32Value.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.Int32Value)
                        return object;
                    var message = new $root.google.protobuf.Int32Value();
                    if (object.value != null)
                        message.value = object.value | 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.Int32Value
                 * @static
                 * @param {google.protobuf.Int32Value} message Int32Value
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Int32Value.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this Int32Value to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.Int32Value
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Int32Value.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Int32Value;
            })();
    
            protobuf.UInt32Value = (function() {
    
                /**
                 * Properties of a UInt32Value.
                 * @memberof google.protobuf
                 * @interface IUInt32Value
                 * @property {number|null} [value] UInt32Value value
                 */
    
                /**
                 * Constructs a new UInt32Value.
                 * @memberof google.protobuf
                 * @classdesc Represents a UInt32Value.
                 * @implements IUInt32Value
                 * @constructor
                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
                 */
                function UInt32Value(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * UInt32Value value.
                 * @member {number} value
                 * @memberof google.protobuf.UInt32Value
                 * @instance
                 */
                UInt32Value.prototype.value = 0;
    
                /**
                 * Creates a new UInt32Value instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
                 * @returns {google.protobuf.UInt32Value} UInt32Value instance
                 */
                UInt32Value.create = function create(properties) {
                    return new UInt32Value(properties);
                };
    
                /**
                 * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt32Value.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UInt32Value.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a UInt32Value message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.UInt32Value} UInt32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt32Value.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.uint32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.UInt32Value} UInt32Value
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UInt32Value.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a UInt32Value message.
                 * @function verify
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                UInt32Value.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isInteger(message.value))
                            return "value: integer expected";
                    return null;
                };
    
                /**
                 * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.UInt32Value} UInt32Value
                 */
                UInt32Value.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.UInt32Value)
                        return object;
                    var message = new $root.google.protobuf.UInt32Value();
                    if (object.value != null)
                        message.value = object.value >>> 0;
                    return message;
                };
    
                /**
                 * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.UInt32Value
                 * @static
                 * @param {google.protobuf.UInt32Value} message UInt32Value
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UInt32Value.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this UInt32Value to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.UInt32Value
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                UInt32Value.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return UInt32Value;
            })();
    
            protobuf.BoolValue = (function() {
    
                /**
                 * Properties of a BoolValue.
                 * @memberof google.protobuf
                 * @interface IBoolValue
                 * @property {boolean|null} [value] BoolValue value
                 */
    
                /**
                 * Constructs a new BoolValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a BoolValue.
                 * @implements IBoolValue
                 * @constructor
                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
                 */
                function BoolValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * BoolValue value.
                 * @member {boolean} value
                 * @memberof google.protobuf.BoolValue
                 * @instance
                 */
                BoolValue.prototype.value = false;
    
                /**
                 * Creates a new BoolValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.IBoolValue=} [properties] Properties to set
                 * @returns {google.protobuf.BoolValue} BoolValue instance
                 */
                BoolValue.create = function create(properties) {
                    return new BoolValue(properties);
                };
    
                /**
                 * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BoolValue.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BoolValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BoolValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.BoolValue} BoolValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BoolValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a BoolValue message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.BoolValue} BoolValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BoolValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a BoolValue message.
                 * @function verify
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BoolValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value !== "boolean")
                            return "value: boolean expected";
                    return null;
                };
    
                /**
                 * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.BoolValue} BoolValue
                 */
                BoolValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.BoolValue)
                        return object;
                    var message = new $root.google.protobuf.BoolValue();
                    if (object.value != null)
                        message.value = Boolean(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.BoolValue
                 * @static
                 * @param {google.protobuf.BoolValue} message BoolValue
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BoolValue.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = false;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this BoolValue to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.BoolValue
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BoolValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return BoolValue;
            })();
    
            protobuf.StringValue = (function() {
    
                /**
                 * Properties of a StringValue.
                 * @memberof google.protobuf
                 * @interface IStringValue
                 * @property {string|null} [value] StringValue value
                 */
    
                /**
                 * Constructs a new StringValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a StringValue.
                 * @implements IStringValue
                 * @constructor
                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
                 */
                function StringValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * StringValue value.
                 * @member {string} value
                 * @memberof google.protobuf.StringValue
                 * @instance
                 */
                StringValue.prototype.value = "";
    
                /**
                 * Creates a new StringValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.IStringValue=} [properties] Properties to set
                 * @returns {google.protobuf.StringValue} StringValue instance
                 */
                StringValue.create = function create(properties) {
                    return new StringValue(properties);
                };
    
                /**
                 * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StringValue.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StringValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a StringValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.StringValue} StringValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StringValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a StringValue message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.StringValue} StringValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StringValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a StringValue message.
                 * @function verify
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                StringValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isString(message.value))
                            return "value: string expected";
                    return null;
                };
    
                /**
                 * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.StringValue} StringValue
                 */
                StringValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.StringValue)
                        return object;
                    var message = new $root.google.protobuf.StringValue();
                    if (object.value != null)
                        message.value = String(object.value);
                    return message;
                };
    
                /**
                 * Creates a plain object from a StringValue message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.StringValue
                 * @static
                 * @param {google.protobuf.StringValue} message StringValue
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                StringValue.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = "";
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };
    
                /**
                 * Converts this StringValue to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.StringValue
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                StringValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return StringValue;
            })();
    
            protobuf.BytesValue = (function() {
    
                /**
                 * Properties of a BytesValue.
                 * @memberof google.protobuf
                 * @interface IBytesValue
                 * @property {Uint8Array|null} [value] BytesValue value
                 */
    
                /**
                 * Constructs a new BytesValue.
                 * @memberof google.protobuf
                 * @classdesc Represents a BytesValue.
                 * @implements IBytesValue
                 * @constructor
                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
                 */
                function BytesValue(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * BytesValue value.
                 * @member {Uint8Array} value
                 * @memberof google.protobuf.BytesValue
                 * @instance
                 */
                BytesValue.prototype.value = $util.newBuffer([]);
    
                /**
                 * Creates a new BytesValue instance using the specified properties.
                 * @function create
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.IBytesValue=} [properties] Properties to set
                 * @returns {google.protobuf.BytesValue} BytesValue instance
                 */
                BytesValue.create = function create(properties) {
                    return new BytesValue(properties);
                };
    
                /**
                 * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
                 * @function encode
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BytesValue.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                    return writer;
                };
    
                /**
                 * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a BytesValue message from the specified reader or buffer.
                 * @function decode
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {google.protobuf.BytesValue} BytesValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BytesValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a BytesValue message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {google.protobuf.BytesValue} BytesValue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                BytesValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a BytesValue message.
                 * @function verify
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                BytesValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                            return "value: buffer expected";
                    return null;
                };
    
                /**
                 * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {google.protobuf.BytesValue} BytesValue
                 */
                BytesValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.google.protobuf.BytesValue)
                        return object;
                    var message = new $root.google.protobuf.BytesValue();
                    if (object.value != null)
                        if (typeof object.value === "string")
                            $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                        else if (object.value.length)
                            message.value = object.value;
                    return message;
                };
    
                /**
                 * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof google.protobuf.BytesValue
                 * @static
                 * @param {google.protobuf.BytesValue} message BytesValue
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                BytesValue.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.value = "";
                        else {
                            object.value = [];
                            if (options.bytes !== Array)
                                object.value = $util.newBuffer(object.value);
                        }
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                    return object;
                };
    
                /**
                 * Converts this BytesValue to JSON.
                 * @function toJSON
                 * @memberof google.protobuf.BytesValue
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                BytesValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return BytesValue;
            })();
    
            return protobuf;
        })();
    
        return google;
    })();

    return $root;
});

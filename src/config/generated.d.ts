import * as $protobuf from "protobufjs";
/** Namespace hypertrace. */
export namespace hypertrace {

    /** Namespace agent. */
    namespace agent {

        /** Namespace config. */
        namespace config {

            /** Namespace v1. */
            namespace v1 {

                /** Properties of an AgentConfig. */
                interface IAgentConfig {

                    /** AgentConfig service_name */
                    service_name?: (google.protobuf.IStringValue|null);

                    /** AgentConfig reporting */
                    reporting?: (hypertrace.agent.config.v1.IReporting|null);

                    /** AgentConfig data_capture */
                    data_capture?: (hypertrace.agent.config.v1.IDataCapture|null);

                    /** AgentConfig propagation_formats */
                    propagation_formats?: (hypertrace.agent.config.v1.PropagationFormat[]|null);

                    /** AgentConfig enabled */
                    enabled?: (google.protobuf.IBoolValue|null);

                    /** AgentConfig javaagent */
                    javaagent?: (hypertrace.agent.config.v1.IJavaAgent|null);

                    /** AgentConfig resource_attributes */
                    resource_attributes?: ({ [k: string]: string }|null);
                }

                /** Represents an AgentConfig. */
                class AgentConfig implements IAgentConfig {

                    /**
                     * Constructs a new AgentConfig.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IAgentConfig);

                    /** AgentConfig service_name. */
                    public service_name?: (google.protobuf.IStringValue|null);

                    /** AgentConfig reporting. */
                    public reporting?: (hypertrace.agent.config.v1.IReporting|null);

                    /** AgentConfig data_capture. */
                    public data_capture?: (hypertrace.agent.config.v1.IDataCapture|null);

                    /** AgentConfig propagation_formats. */
                    public propagation_formats: hypertrace.agent.config.v1.PropagationFormat[];

                    /** AgentConfig enabled. */
                    public enabled?: (google.protobuf.IBoolValue|null);

                    /** AgentConfig javaagent. */
                    public javaagent?: (hypertrace.agent.config.v1.IJavaAgent|null);

                    /** AgentConfig resource_attributes. */
                    public resource_attributes: { [k: string]: string };

                    /**
                     * Creates a new AgentConfig instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns AgentConfig instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IAgentConfig): hypertrace.agent.config.v1.AgentConfig;

                    /**
                     * Encodes the specified AgentConfig message. Does not implicitly {@link hypertrace.agent.config.v1.AgentConfig.verify|verify} messages.
                     * @param message AgentConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IAgentConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified AgentConfig message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.AgentConfig.verify|verify} messages.
                     * @param message AgentConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IAgentConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an AgentConfig message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns AgentConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.AgentConfig;

                    /**
                     * Decodes an AgentConfig message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns AgentConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.AgentConfig;

                    /**
                     * Verifies an AgentConfig message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an AgentConfig message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns AgentConfig
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.AgentConfig;

                    /**
                     * Creates a plain object from an AgentConfig message. Also converts values to other types if specified.
                     * @param message AgentConfig
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.AgentConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this AgentConfig to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a Reporting. */
                interface IReporting {

                    /** Reporting endpoint */
                    endpoint?: (google.protobuf.IStringValue|null);

                    /** Reporting secure */
                    secure?: (google.protobuf.IBoolValue|null);

                    /** Reporting token */
                    token?: (google.protobuf.IStringValue|null);

                    /** Reporting opa */
                    opa?: (hypertrace.agent.config.v1.IOpa|null);

                    /** Reporting trace_reporter_type */
                    trace_reporter_type?: (hypertrace.agent.config.v1.TraceReporterType|null);
                }

                /** Represents a Reporting. */
                class Reporting implements IReporting {

                    /**
                     * Constructs a new Reporting.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IReporting);

                    /** Reporting endpoint. */
                    public endpoint?: (google.protobuf.IStringValue|null);

                    /** Reporting secure. */
                    public secure?: (google.protobuf.IBoolValue|null);

                    /** Reporting token. */
                    public token?: (google.protobuf.IStringValue|null);

                    /** Reporting opa. */
                    public opa?: (hypertrace.agent.config.v1.IOpa|null);

                    /** Reporting trace_reporter_type. */
                    public trace_reporter_type: hypertrace.agent.config.v1.TraceReporterType;

                    /**
                     * Creates a new Reporting instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Reporting instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IReporting): hypertrace.agent.config.v1.Reporting;

                    /**
                     * Encodes the specified Reporting message. Does not implicitly {@link hypertrace.agent.config.v1.Reporting.verify|verify} messages.
                     * @param message Reporting message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IReporting, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Reporting message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Reporting.verify|verify} messages.
                     * @param message Reporting message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IReporting, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Reporting message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Reporting
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.Reporting;

                    /**
                     * Decodes a Reporting message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Reporting
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.Reporting;

                    /**
                     * Verifies a Reporting message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Reporting message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Reporting
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.Reporting;

                    /**
                     * Creates a plain object from a Reporting message. Also converts values to other types if specified.
                     * @param message Reporting
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.Reporting, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Reporting to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of an Opa. */
                interface IOpa {

                    /** Opa endpoint */
                    endpoint?: (google.protobuf.IStringValue|null);

                    /** Opa poll_period_seconds */
                    poll_period_seconds?: (google.protobuf.IInt32Value|null);

                    /** Opa enabled */
                    enabled?: (google.protobuf.IBoolValue|null);
                }

                /** Represents an Opa. */
                class Opa implements IOpa {

                    /**
                     * Constructs a new Opa.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IOpa);

                    /** Opa endpoint. */
                    public endpoint?: (google.protobuf.IStringValue|null);

                    /** Opa poll_period_seconds. */
                    public poll_period_seconds?: (google.protobuf.IInt32Value|null);

                    /** Opa enabled. */
                    public enabled?: (google.protobuf.IBoolValue|null);

                    /**
                     * Creates a new Opa instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Opa instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IOpa): hypertrace.agent.config.v1.Opa;

                    /**
                     * Encodes the specified Opa message. Does not implicitly {@link hypertrace.agent.config.v1.Opa.verify|verify} messages.
                     * @param message Opa message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IOpa, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Opa message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Opa.verify|verify} messages.
                     * @param message Opa message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IOpa, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an Opa message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Opa
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.Opa;

                    /**
                     * Decodes an Opa message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Opa
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.Opa;

                    /**
                     * Verifies an Opa message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an Opa message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Opa
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.Opa;

                    /**
                     * Creates a plain object from an Opa message. Also converts values to other types if specified.
                     * @param message Opa
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.Opa, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Opa to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a Message. */
                interface IMessage {

                    /** Message request */
                    request?: (google.protobuf.IBoolValue|null);

                    /** Message response */
                    response?: (google.protobuf.IBoolValue|null);
                }

                /** Represents a Message. */
                class Message implements IMessage {

                    /**
                     * Constructs a new Message.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IMessage);

                    /** Message request. */
                    public request?: (google.protobuf.IBoolValue|null);

                    /** Message response. */
                    public response?: (google.protobuf.IBoolValue|null);

                    /**
                     * Creates a new Message instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Message instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IMessage): hypertrace.agent.config.v1.Message;

                    /**
                     * Encodes the specified Message message. Does not implicitly {@link hypertrace.agent.config.v1.Message.verify|verify} messages.
                     * @param message Message message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Message message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.Message.verify|verify} messages.
                     * @param message Message message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Message message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Message
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.Message;

                    /**
                     * Decodes a Message message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Message
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.Message;

                    /**
                     * Verifies a Message message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Message message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Message
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.Message;

                    /**
                     * Creates a plain object from a Message message. Also converts values to other types if specified.
                     * @param message Message
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.Message, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Message to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** Properties of a DataCapture. */
                interface IDataCapture {

                    /** DataCapture http_headers */
                    http_headers?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture http_body */
                    http_body?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture rpc_metadata */
                    rpc_metadata?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture rpc_body */
                    rpc_body?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture body_max_size_bytes */
                    body_max_size_bytes?: (google.protobuf.IInt32Value|null);
                }

                /** Represents a DataCapture. */
                class DataCapture implements IDataCapture {

                    /**
                     * Constructs a new DataCapture.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IDataCapture);

                    /** DataCapture http_headers. */
                    public http_headers?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture http_body. */
                    public http_body?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture rpc_metadata. */
                    public rpc_metadata?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture rpc_body. */
                    public rpc_body?: (hypertrace.agent.config.v1.IMessage|null);

                    /** DataCapture body_max_size_bytes. */
                    public body_max_size_bytes?: (google.protobuf.IInt32Value|null);

                    /**
                     * Creates a new DataCapture instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DataCapture instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IDataCapture): hypertrace.agent.config.v1.DataCapture;

                    /**
                     * Encodes the specified DataCapture message. Does not implicitly {@link hypertrace.agent.config.v1.DataCapture.verify|verify} messages.
                     * @param message DataCapture message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IDataCapture, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DataCapture message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.DataCapture.verify|verify} messages.
                     * @param message DataCapture message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IDataCapture, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DataCapture message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DataCapture
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.DataCapture;

                    /**
                     * Decodes a DataCapture message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DataCapture
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.DataCapture;

                    /**
                     * Verifies a DataCapture message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DataCapture message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DataCapture
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.DataCapture;

                    /**
                     * Creates a plain object from a DataCapture message. Also converts values to other types if specified.
                     * @param message DataCapture
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.DataCapture, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DataCapture to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                /** PropagationFormat enum. */
                enum PropagationFormat {
                    B3 = 0,
                    TRACECONTEXT = 1
                }

                /** TraceReporterType enum. */
                enum TraceReporterType {
                    UNSPECIFIED = 0,
                    ZIPKIN = 1,
                    OTLP = 2,
                    LOGGING = 3
                }

                /** Properties of a JavaAgent. */
                interface IJavaAgent {

                    /** JavaAgent filter_jar_paths */
                    filter_jar_paths?: (google.protobuf.IStringValue[]|null);
                }

                /** Represents a JavaAgent. */
                class JavaAgent implements IJavaAgent {

                    /**
                     * Constructs a new JavaAgent.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: hypertrace.agent.config.v1.IJavaAgent);

                    /** JavaAgent filter_jar_paths. */
                    public filter_jar_paths: google.protobuf.IStringValue[];

                    /**
                     * Creates a new JavaAgent instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JavaAgent instance
                     */
                    public static create(properties?: hypertrace.agent.config.v1.IJavaAgent): hypertrace.agent.config.v1.JavaAgent;

                    /**
                     * Encodes the specified JavaAgent message. Does not implicitly {@link hypertrace.agent.config.v1.JavaAgent.verify|verify} messages.
                     * @param message JavaAgent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: hypertrace.agent.config.v1.IJavaAgent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JavaAgent message, length delimited. Does not implicitly {@link hypertrace.agent.config.v1.JavaAgent.verify|verify} messages.
                     * @param message JavaAgent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: hypertrace.agent.config.v1.IJavaAgent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JavaAgent message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JavaAgent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hypertrace.agent.config.v1.JavaAgent;

                    /**
                     * Decodes a JavaAgent message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JavaAgent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hypertrace.agent.config.v1.JavaAgent;

                    /**
                     * Verifies a JavaAgent message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a JavaAgent message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns JavaAgent
                     */
                    public static fromObject(object: { [k: string]: any }): hypertrace.agent.config.v1.JavaAgent;

                    /**
                     * Creates a plain object from a JavaAgent message. Also converts values to other types if specified.
                     * @param message JavaAgent
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: hypertrace.agent.config.v1.JavaAgent, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this JavaAgent to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DoubleValue instance
             */
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;

            /**
             * Verifies a DoubleValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DoubleValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @param message DoubleValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DoubleValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatValue instance
             */
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;

            /**
             * Verifies a FloatValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @param message FloatValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|Long|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: (number|Long);

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int64Value instance
             */
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;

            /**
             * Verifies an Int64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @param message Int64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|Long|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: (number|Long);

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt64Value instance
             */
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;

            /**
             * Verifies a UInt64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @param message UInt64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int32Value instance
             */
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;

            /**
             * Verifies an Int32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @param message Int32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt32Value instance
             */
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;

            /**
             * Verifies a UInt32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @param message UInt32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BoolValue instance
             */
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;

            /**
             * Verifies a BoolValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BoolValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @param message BoolValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BoolValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;

            /**
             * Creates a new StringValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StringValue instance
             */
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;

            /**
             * Verifies a StringValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StringValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @param message StringValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StringValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BytesValue instance
             */
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;

            /**
             * Verifies a BytesValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BytesValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @param message BytesValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BytesValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

import {SpanAttributes} from "@opentelemetry/api";
import {SpanAttributeValue} from "@opentelemetry/api/build/src/trace/attributes";

export class AttrWrapper implements SpanAttributes {
    [attributeKey: string]: SpanAttributeValue | undefined;
}
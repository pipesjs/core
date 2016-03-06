import assert from "assert";
import streams from "../src/streams";
import { ReadableStream, WritableStream } from "../src/streams";

suite("API Access");

test("default access", () => assert( typeof streams.ReadableStream === "function" ));
test("direct access", () => assert( typeof ReadableStream === "function" ));

import assert from "assert";
import streams from "../src/streams";

suite("API Access");

test("ReadableStream access", () => assert( streams.ReadableStream ));

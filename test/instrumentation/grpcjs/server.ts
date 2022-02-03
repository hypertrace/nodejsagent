import {ProtoGrpcType} from "@grpc/grpc-js/build/src/generated/channelz";

const protoLoader = require('@grpc/proto-loader');
import * as grpc from '@grpc/grpc-js';
import {ServerUnaryCall} from "@grpc/grpc-js";
const packageDefinition = protoLoader.loadSync(`${__dirname}/notes.proto`);

const proto = (grpc.loadPackageDefinition(
    packageDefinition
) as unknown) as ProtoGrpcType;

const notes = {notes: [
    { id: '1', title: 'Note 1', description: 'Content 1' },
    { id: '2', title: 'Note 2', description: 'Content 2' }
]}

function List (call, callback) {
    console.log('in function')
    let metadata = new grpc.Metadata();
    metadata.add('some-metadata-key-from-server', 'some-metadata-server-value');
    call.sendMetadata(metadata)
    return callback(null, notes)
}

function Find ({ request: { id } }, callback) {
    return callback(null, notes['notes'].find((note) => note.id === id))
}

export const server = new grpc.Server()
// @ts-ignore
server.addService(proto.NoteService.service, { List, Find })


import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type Task4Config = {};

export function task4ConfigToCell(config: Task4Config): Cell {
    return beginCell().endCell();
}

export class Task4 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Task4(address);
    }

    static createFromConfig(config: Task4Config, code: Cell, workchain = 0) {
        const data = task4ConfigToCell(config);
        const init = { code, data };
        return new Task4(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_ascii(provider: ContractProvider, char: string) {
        const result = await provider.get('get_ascii', [
            { type: 'cell', cell: beginCell().storeBuffer(new Buffer(char)).endCell() },]);

        return result.stack.readNumber();
    }

    async get_char(provider: ContractProvider, char: number) {
        const result = await provider.get('get_char', [
            { type: 'int', value: BigInt(char) },]);

        return result.stack.readString();
    }

    async get_caesar_cipher_encrypt(provider: ContractProvider, shift: number, text: string) {
        const result = await provider.get('caesar_cipher_encrypt', [
            { type: 'int', value: BigInt(shift) },
            { type: 'cell', cell: beginCell().storeUint(0, 32).storeBuffer(new Buffer(text)).endCell() }]);

        return result.stack.readString();
    }

    async get_caesar_cipher_decrypt(provider: ContractProvider, shift: number, text: string) {
        const result = await provider.get('caesar_cipher_decrypt', [
            { type: 'int', value: BigInt(shift) },
            { type: 'cell', cell: beginCell().storeBuffer(new Buffer(text)).endCell() }]);

        return result.stack.readString();
    }

}

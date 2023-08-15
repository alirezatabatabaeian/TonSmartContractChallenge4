import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell().endCell();
}

export class Task3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Task3(address);
    }

    static createFromConfig(config: Task3Config, code: Cell, workchain = 0) {
        const data = task3ConfigToCell(config);
        const init = { code, data };
        return new Task3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_all_data_bits_test(provider: ContractProvider, n: number,) {
        const result = await provider.get('all_data_bits_test', [
            {
                type: 'cell', cell: beginCell()
                    .storeUint(0, 25)
                    .storeRef(beginCell()
                        .storeRef(beginCell()
                            .storeUint(1, 35)
                            .endCell())
                        .endCell())
                    .endCell()
            },
            { type: 'int', value: BigInt(n) },
        ]);

        return result.stack.readNumber();
    }
}

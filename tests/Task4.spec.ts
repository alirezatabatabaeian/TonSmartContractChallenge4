import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    // it('should deploy', async () => {
    //     console.log("Input Character is AB:", await task4.get_ascii("A"))
    // });

    // it('should deploy', async () => {
    //     console.log("Input Character is AB:", await task4.get_char(65 + 128))
    // });

    it('should deploy', async () => {
        let shift = 27632471
        let text = "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_"
        console.log("Outpu Character is:", await task4.get_caesar_cipher_encrypt(shift, text))

        text = await task4.get_caesar_cipher_encrypt(shift, text)
        console.log("Outpu Character is:", await task4.get_caesar_cipher_decrypt(shift, text))
    });
});

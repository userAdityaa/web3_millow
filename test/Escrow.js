const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate; 
    beforeEach(async() => { 
        [buyer, seller, inspector, lender] = await ethers.getSigners();
        const RealEstate = ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deployed();

        let transaction = await realEstate.connect(seller).mint(buyer.address, tokens(1));

        await transaction.wait(); 

        const Escrow = await ethers.getContractFactory('Escrow');

        escrow = await Escrow.deploy(realEstate.address, buyer.address, seller.address, inspector.address, lender.address);
    })

    describe('Deployment', () => { 
        it('Returns NFT Address', async() => { 
            let result = await escrow.nftAddress(); 
            expect(result).to.equal(realEstate.address);
        })

        it('Returns seller', async() => { 
            let result = await escrow.seller(); 
            expect(result).to.equal(seller.address);
        })

        it('Returns inspector', async() => {     
            let result = await escrow.inspector(); 
            expect(result).to.equal(inspector.address);
        })

        it('Returns lender', async() => {     
            let result = await escrow.lender(); 
            expect(result).to.equal(lender.address);
        })
    })
})

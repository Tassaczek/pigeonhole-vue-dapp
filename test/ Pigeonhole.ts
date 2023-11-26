const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('Pigeonhole', function () {
  async function deployPigeonholeFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const pigeonhole = await ethers.deployContract('Pigeonhole');
    await pigeonhole.waitForDeployment();

    return { pigeonhole, owner, addr1, addr2 };
  }
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { pigeonhole, owner } = await loadFixture(deployPigeonholeFixture);

      expect(await pigeonhole.owner()).to.equal(owner.address);
    });
  });
  describe('Creating meeting', function () {
    it('should let owner to create a new meeting', async function () {
      const { pigeonhole, owner } = await loadFixture(deployPigeonholeFixture);
      const meetingName = 'Foo meeting name created by the owner';

      await expect(pigeonhole.createMeeting(meetingName)).to.emit(pigeonhole, 'MeetingCreated').withArgs(owner.address, 0, meetingName);
    });
    it('should let other users to create a new meeting', async function () {
      const { pigeonhole, addr1 } = await loadFixture(deployPigeonholeFixture);
      const meetingName = 'Foo meeting name created by someone else';
      const meetingByAddr1 = await pigeonhole.connect(addr1).createMeeting(meetingName);

      await expect(meetingByAddr1).to.emit(pigeonhole, 'MeetingCreated').withArgs(addr1.address, 0, meetingName);
    });
  });
  describe('Asking questions', function () {
    it('should allow users to ask questions in a meeting', async function () {
      const { pigeonhole, owner, addr1 } = await loadFixture(deployPigeonholeFixture);
      const meetingName = 'Test Meeting';
      const questionContent = 'What is the purpose of this meeting?';
      const userQuestionContent = 'When we will get a rise?';

      await pigeonhole.createMeeting(meetingName);

      const ownerQuestion = await pigeonhole.askQuestion(owner.address, 0, questionContent);
      expect(ownerQuestion).to.not.be.reverted;
      expect(ownerQuestion).to.emit(pigeonhole, 'QuestionAsked').withArgs(owner.address, 0, questionContent);

      const userQuestion = await pigeonhole.connect(addr1).askQuestion(owner.address, 0, userQuestionContent);
      expect(userQuestion).to.not.be.reverted;
      expect(userQuestion).to.emit(pigeonhole, 'QuestionAsked').withArgs(owner.address, 0, userQuestionContent);
    });
  });
});

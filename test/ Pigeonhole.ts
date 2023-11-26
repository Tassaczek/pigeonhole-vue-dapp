const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Pigeonhole', function () {
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const [owner] = await ethers.getSigners();

      const Pigeonhole = await ethers.deployContract('Pigeonhole');
      expect(await Pigeonhole.owner()).to.equal(owner.address);
    });
  });
  describe('Creating meeting', function () {
    it('should let owner to create a new meeting', async function () {
      const [owner] = await ethers.getSigners();
      const Pigeonhole = await ethers.deployContract('Pigeonhole');
      const meetingName = 'Foo meeting name created by the owner';

      await expect(Pigeonhole.createMeeting(meetingName)).to.emit(Pigeonhole, 'MeetingCreated').withArgs(owner.address, 0, meetingName);
    });
    it('should let other users to create a new meeting', async function () {
      const [_, addr1] = await ethers.getSigners();
      const Pigeonhole = await ethers.deployContract('Pigeonhole');
      const meetingName = 'Foo meeting name created by someone else';

      const meetingByAddr1 = await Pigeonhole.connect(addr1).createMeeting(meetingName);

      await expect(meetingByAddr1).to.emit(Pigeonhole, 'MeetingCreated').withArgs(addr1.address, 0, meetingName);
    });
  });
  describe('Asking questions', function () {
    it('should allow users to ask questions in a meeting', async function () {
      const [owner, addr1] = await ethers.getSigners();
      const Pigeonhole = await ethers.deployContract('Pigeonhole');
      const meetingName = 'Test Meeting';
      const questionContent = 'What is the purpose of this meeting?';
      const userQuestionContent = 'When we will get a rise?';

      await Pigeonhole.createMeeting(meetingName);
      const ownerQuestion = await Pigeonhole.askQuestion(owner.address, 0, questionContent);
      expect(ownerQuestion).to.not.be.reverted;
      expect(ownerQuestion).to.emit(Pigeonhole, 'QuestionAsked').withArgs(owner.address, 0, questionContent);

      const userQuestion = await Pigeonhole.connect(addr1).askQuestion(owner.address, 0, userQuestionContent);
      expect(userQuestion).to.not.be.reverted;
      expect(userQuestion).to.emit(Pigeonhole, 'QuestionAsked').withArgs(owner.address, 0, userQuestionContent);
    });
  });
});

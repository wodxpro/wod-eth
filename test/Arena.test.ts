import { expect } from "chai";
import { ethers } from "hardhat";
import { WODToken, Arena, ValidatorRegistry } from "../typechain-types";

describe("WOD X PRO Protocol - Arena", function () {
  let wodToken: WODToken;
  let validatorRegistry: ValidatorRegistry;
  let arena: Arena;
  let owner: any;
  let athlete: any;
  let validator: any;

  beforeEach(async function () {
    [owner, athlete, validator] = await ethers.getSigners();

    // Deploy WODToken
    const WODToken = await ethers.getContractFactory("WODToken");
    wodToken = await WODToken.deploy(owner.address);
    await wodToken.waitForDeployment();

    // Mint tokens para teste
    const tokenAmount = ethers.parseEther("10000");
    await wodToken.mint(athlete.address, tokenAmount, "Test tokens for athlete");
    await wodToken.mint(validator.address, tokenAmount, "Test tokens for validator");

    // Deploy ValidatorRegistry
    const ValidatorRegistry = await ethers.getContractFactory("ValidatorRegistry");
    const minStake = ethers.parseEther("1000");
    validatorRegistry = await ValidatorRegistry.deploy(
      await wodToken.getAddress(),
      owner.address,
      minStake
    );
    await validatorRegistry.waitForDeployment();

    // Deploy Arena
    const Arena = await ethers.getContractFactory("Arena");
    arena = await Arena.deploy(
      await wodToken.getAddress(),
      await validatorRegistry.getAddress(),
      owner.address
    );
    await arena.waitForDeployment();

    // Validator faz stake
    await wodToken.connect(validator).approve(
      await validatorRegistry.getAddress(),
      ethers.parseEther("1000")
    );
    await validatorRegistry.connect(validator).registerValidator(ethers.parseEther("1000"));
  });

  describe("Challenge Creation", function () {
    it("Should create a new challenge", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400; // 1 dia
      const entryFee = ethers.parseEther("100");

      await expect(
        arena.createChallenge(
          "Test Challenge",
          "Test Description",
          entryFee,
          startTime,
          endTime
        )
      ).to.emit(arena, "ChallengeCreated");

      const challenge = await arena.getChallenge(1);
      expect(challenge.name).to.equal("Test Challenge");
      expect(challenge.entryFee).to.equal(entryFee);
    });
  });

  describe("Challenge Entry", function () {
    it("Should allow athlete to enter challenge", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;
      const entryFee = ethers.parseEther("100");

      await arena.createChallenge(
        "Test Challenge",
        "Test Description",
        entryFee,
        startTime,
        endTime
      );

      await wodToken.connect(athlete).approve(await arena.getAddress(), entryFee);

      await expect(
        arena.connect(athlete).enterChallenge(1)
      ).to.emit(arena, "ChallengeEntered");

      const challenge = await arena.getChallenge(1);
      expect(challenge.prizePool).to.equal(entryFee);
    });
  });

  describe("Proof Submission", function () {
    it("Should allow athlete to submit proof", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;
      const entryFee = ethers.parseEther("100");
      const proofCID = "QmTestCID123456789";

      await arena.createChallenge(
        "Test Challenge",
        "Test Description",
        entryFee,
        startTime,
        endTime
      );

      await wodToken.connect(athlete).approve(await arena.getAddress(), entryFee);
      await arena.connect(athlete).enterChallenge(1);

      await expect(
        arena.connect(athlete).submitProof(1, proofCID)
      ).to.emit(arena, "SubmissionSubmitted");

      const submission = await arena.getSubmission(1, athlete.address);
      expect(submission.proofCID).to.equal(proofCID);
      expect(submission.exists).to.be.true;
    });
  });

  describe("Validator Voting", function () {
    it("Should allow validator to vote", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;
      const entryFee = ethers.parseEther("100");
      const proofCID = "QmTestCID123456789";

      await arena.createChallenge(
        "Test Challenge",
        "Test Description",
        entryFee,
        startTime,
        endTime
      );

      await wodToken.connect(athlete).approve(await arena.getAddress(), entryFee);
      await arena.connect(athlete).enterChallenge(1);
      await arena.connect(athlete).submitProof(1, proofCID);

      await expect(
        arena.connect(validator).vote(1, athlete.address, true)
      ).to.emit(arena, "VoteCast");
    });
  });
});


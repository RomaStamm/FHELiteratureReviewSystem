const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiteratureReviewSystem", function () {
  let literatureReviewSystem;
  let owner;
  let author1;
  let author2;
  let reviewer1;
  let reviewer2;

  beforeEach(async function () {
    // Get signers
    [owner, author1, author2, reviewer1, reviewer2] = await ethers.getSigners();

    // Deploy contract
    const LiteratureReviewSystem = await ethers.getContractFactory("LiteratureReviewSystem");
    literatureReviewSystem = await LiteratureReviewSystem.deploy();
    await literatureReviewSystem.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await literatureReviewSystem.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct periods", async function () {
      expect(await literatureReviewSystem.currentSubmissionPeriod()).to.equal(1);
      expect(await literatureReviewSystem.currentReviewPeriod()).to.equal(0);
    });

    it("Should have zero work count initially", async function () {
      const period = await literatureReviewSystem.currentSubmissionPeriod();
      expect(await literatureReviewSystem.workCountPerPeriod(period)).to.equal(0);
    });
  });

  describe("Reviewer Registration", function () {
    it("Should allow users to register as reviewers", async function () {
      await literatureReviewSystem.connect(reviewer1).registerReviewer("Dr. Jane Smith", "Contemporary Fiction");

      const profile = await literatureReviewSystem.getReviewerProfile(reviewer1.address);
      expect(profile.name).to.equal("Dr. Jane Smith");
      expect(profile.expertise).to.equal("Contemporary Fiction");
      expect(profile.isActive).to.equal(false);
      expect(profile.reviewCount).to.equal(0);
    });

    it("Should emit ReviewerRegistered event", async function () {
      await expect(literatureReviewSystem.connect(reviewer1).registerReviewer("Dr. Jane Smith", "Contemporary Fiction"))
        .to.emit(literatureReviewSystem, "ReviewerRegistered")
        .withArgs(reviewer1.address, "Dr. Jane Smith");
    });

    it("Should allow owner to approve reviewers", async function () {
      await literatureReviewSystem.connect(reviewer1).registerReviewer("Dr. Jane Smith", "Contemporary Fiction");
      await literatureReviewSystem.connect(owner).approveReviewer(reviewer1.address);

      const profile = await literatureReviewSystem.getReviewerProfile(reviewer1.address);
      expect(profile.isActive).to.equal(true);

      const isAuthorized = await literatureReviewSystem.authorizedReviewers(reviewer1.address);
      expect(isAuthorized).to.equal(true);
    });

    it("Should revert if non-owner tries to approve reviewer", async function () {
      await literatureReviewSystem.connect(reviewer1).registerReviewer("Dr. Jane Smith", "Contemporary Fiction");

      await expect(
        literatureReviewSystem.connect(author1).approveReviewer(reviewer1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should revert if approving non-registered reviewer", async function () {
      await expect(literatureReviewSystem.connect(owner).approveReviewer(reviewer1.address)).to.be.revertedWith(
        "Reviewer not registered"
      );
    });
  });

  describe("Period Management", function () {
    it("Should check submission period status", async function () {
      const isActive = await literatureReviewSystem.isSubmissionPeriodActive();
      expect(typeof isActive).to.equal("boolean");
    });

    it("Should check review period status", async function () {
      const isActive = await literatureReviewSystem.isReviewPeriodActive();
      expect(typeof isActive).to.equal("boolean");
    });

    it("Should return correct period statistics", async function () {
      const currentPeriod = await literatureReviewSystem.currentSubmissionPeriod();
      const stats = await literatureReviewSystem.getPeriodStats(currentPeriod);

      expect(stats.totalSubmissions).to.equal(0);
      expect(typeof stats.submissionActive).to.equal("boolean");
      expect(typeof stats.reviewActive).to.equal("boolean");
    });
  });

  describe("Work Submission", function () {
    it("Should allow submission during active period", async function () {
      const isSubmissionActive = await literatureReviewSystem.isSubmissionPeriodActive();

      if (isSubmissionActive) {
        await literatureReviewSystem
          .connect(author1)
          .submitWork("The Great Novel", "John Doe", "Fiction", "QmTest123");

        const currentPeriod = await literatureReviewSystem.currentSubmissionPeriod();
        const workCount = await literatureReviewSystem.workCountPerPeriod(currentPeriod);
        expect(workCount).to.equal(1);

        const submission = await literatureReviewSystem.getSubmissionInfo(currentPeriod, 1);
        expect(submission.title).to.equal("The Great Novel");
        expect(submission.author).to.equal("John Doe");
        expect(submission.genre).to.equal("Fiction");
        expect(submission.submitted).to.equal(true);
        expect(submission.reviewed).to.equal(false);
        expect(submission.submitter).to.equal(author1.address);
      } else {
        await expect(
          literatureReviewSystem.connect(author1).submitWork("The Great Novel", "John Doe", "Fiction", "QmTest123")
        ).to.be.revertedWith("Not during submission period");
      }
    });

    it("Should emit WorkSubmitted event", async function () {
      const isSubmissionActive = await literatureReviewSystem.isSubmissionPeriodActive();

      if (isSubmissionActive) {
        const currentPeriod = await literatureReviewSystem.currentSubmissionPeriod();

        await expect(
          literatureReviewSystem.connect(author1).submitWork("The Great Novel", "John Doe", "Fiction", "QmTest123")
        )
          .to.emit(literatureReviewSystem, "WorkSubmitted")
          .withArgs(currentPeriod, 1, author1.address);
      }
    });
  });

  describe("Review Submission", function () {
    beforeEach(async function () {
      // Register and approve reviewers
      await literatureReviewSystem.connect(reviewer1).registerReviewer("Dr. Jane Smith", "Contemporary Fiction");
      await literatureReviewSystem.connect(owner).approveReviewer(reviewer1.address);
    });

    it("Should validate score ranges", async function () {
      const isReviewActive = await literatureReviewSystem.isReviewPeriodActive();
      const isSubmissionActive = await literatureReviewSystem.isSubmissionPeriodActive();

      if (isReviewActive && isSubmissionActive) {
        // First submit a work
        await literatureReviewSystem.connect(author1).submitWork("Test Work", "Author", "Fiction", "QmTest");

        // Try to submit review with invalid scores
        await expect(
          literatureReviewSystem.connect(reviewer1).submitReview(1, 0, 50, 50, "Comment")
        ).to.be.revertedWith("Quality score must be 1-100");

        await expect(
          literatureReviewSystem.connect(reviewer1).submitReview(1, 50, 101, 50, "Comment")
        ).to.be.revertedWith("Originality score must be 1-100");

        await expect(
          literatureReviewSystem.connect(reviewer1).submitReview(1, 50, 50, 0, "Comment")
        ).to.be.revertedWith("Impact score must be 1-100");
      }
    });

    it("Should only allow authorized reviewers", async function () {
      const isReviewActive = await literatureReviewSystem.isReviewPeriodActive();

      if (isReviewActive) {
        await expect(
          literatureReviewSystem.connect(author1).submitReview(1, 80, 85, 90, "Good work")
        ).to.be.revertedWith("Not authorized reviewer");
      }
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to start submission period", async function () {
      await expect(literatureReviewSystem.connect(author1).startSubmissionPeriod()).to.be.revertedWith(
        "Not authorized"
      );
    });

    it("Should only allow owner to start review period", async function () {
      await expect(literatureReviewSystem.connect(author1).startReviewPeriod()).to.be.revertedWith("Not authorized");
    });

    it("Should only allow owner to calculate results", async function () {
      await expect(literatureReviewSystem.connect(author1).calculateResults(1)).to.be.revertedWith("Not authorized");
    });

    it("Should only allow owner to announce awards", async function () {
      await expect(literatureReviewSystem.connect(author1).announceAwards(1)).to.be.revertedWith("Not authorized");
    });
  });

  describe("View Functions", function () {
    it("Should return empty submission info for non-existent work", async function () {
      const currentPeriod = await literatureReviewSystem.currentSubmissionPeriod();
      const submission = await literatureReviewSystem.getSubmissionInfo(currentPeriod, 999);

      expect(submission.submitted).to.equal(false);
      expect(submission.title).to.equal("");
    });

    it("Should return empty reviewer profile for non-existent reviewer", async function () {
      const profile = await literatureReviewSystem.getReviewerProfile(author1.address);

      expect(profile.name).to.equal("");
      expect(profile.isActive).to.equal(false);
      expect(profile.reviewCount).to.equal(0);
    });

    it("Should return empty awards for period with no awards", async function () {
      const awards = await literatureReviewSystem.getAwards(1);

      expect(awards.categories.length).to.equal(0);
      expect(awards.winners.length).to.equal(0);
      expect(awards.announced.length).to.equal(0);
    });
  });
});

const mongoose = require("mongoose");
const cron = require("node-cron");
const User = require("../models/User");
const Contest = require("../models/Contest");
const mailSender = require("../Utils/mailSender");
const { contestEmail } = require("../mail/template");

const sendContestEmails = async () => {
  const users = await User.find({});

  const upcomingContests = await Contest.find({});
console.log("API CALLED");
console.log(upcomingContests);


  if (upcomingContests.length === 0) {
    console.log("No Upcoming Contests");
    return;
  }

  for (const contest of upcomingContests) {
    const usersToNotify = users.filter(
      (user) => !contest.notifiedUsers.registeredTime.includes(user.email)
    );

    if (usersToNotify.length === 0) continue;

    for (const user of usersToNotify) {
      const emailMessage = contestEmail(user.userName, contest.name, contest.link);

      try {
        await mailSender(user.email, `New Contest: ${contest.name}`, emailMessage);

        await Contest.updateOne(
          { _id: contest._id },
          { $push: { "notifiedUsers.registeredTime": user.email } } 
        );

        console.log(`Email sent to ${user.email} for contest: ${contest.name}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }
  }
};


const scheduleEmailTask = async () => {
  
  console.log("Email task scheduled");
  
  await sendContestEmails(); 
  cron.schedule("0 */12 * * *", sendContestEmails);
};

exports.scheduleEmailTask = scheduleEmailTask;

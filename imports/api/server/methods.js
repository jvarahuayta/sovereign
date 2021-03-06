import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import { genesisTransaction } from '/imports/api/transactions/transaction';
import { Contracts } from '/imports/api/contracts/Contracts';
import { getTime } from '/imports/api/time';


Meteor.methods({
  /**
  * @summary sends email verififcation
  * @return {Object} email content
  */
  sendVerificationLink() {
    const userId = Meteor.userId();
    console.log(`{ method: 'sendVerificationLink', user: ${Meteor.user().username} }`);
    if (userId) {
      return Accounts.sendVerificationEmail(userId);
    }
    return false;
  },

  /**
  * @summary gives user subsidy with inital tokens
  */
  subsidizeUser() {
    console.log(`{ method: 'subsidizeUser', user: ${Meteor.user().username} }`);
    genesisTransaction(Meteor.user()._id);
  },


  /**
  * @summary given a keyword returns contract id
  * @param {keyword} keyword identify contract by given keyword
  */
  getContract(keyword) {
    check(keyword, String);

    console.log(`{ method: 'getContract', user: ${Meteor.user().username}, keyword: '${keyword}' }`);
    return Contracts.findOne({ keyword });
  },

  /**
  * @summary given a keyword returns contract id
  * @param {keyword} keyword identify contract by given keyword
  */
  getContractById(contractId) {
    check(contractId, String);

    console.log(`{ method: 'getContractById', user: '${Meteor.user().username}', _id: '${contractId}' }`);
    return Contracts.findOne({ _id: contractId });
  },

  /**
  * @summary given a username returns user Id
  * @param {keyword} keyword identify contract by given keyword
  */
  getUser(username) {
    check(username, String);

    console.log(`{ method: 'getUser', user: '${Meteor.user().username}', keyword: '${username}' }`);
    const user = Meteor.users.findOne({ username });
    return {
      _id: user._id,
      username: user.username,
      profile: user.profile,
    };
  },

  /**
  * @summary reports server time from server to client
  * @return {Date} time
  */
  getServerTime() {
    return getTime();
  },

  /**
  * @summary counts the total items on a collection.
  * @return {Number} total count.
  */
  feedCount(query, options) {
    check(query, Object);
    check(options, Object);

    const count = Contracts.find(query, options).count();
    if (Meteor.user()) {
      console.log(`{ method: 'feedCount', user: '${Meteor.user().username}', count: ${count} }`);
    } else {
      console.log(`{ method: 'feedCount', user: [anonymous], count: ${count} }`);
    }

    return count;
  },

  /**
  * @summary counts the total users on the collective
  * @return {Number} total count.
  */
  userCount() {
    const count = Meteor.users.find().count();

    if (Meteor.user()) {
      console.log(`{ method: 'userCount', user: '${Meteor.user().username}', count: ${count} }`);
    } else {
      console.log(`{ method: 'userCount', user: [anonymous], count: ${count} }`);
    }
    return count;
  },
});

module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    return async function ({ event }) {
        const { threadID, logMessageType, logMessageData } = event;
        const { setData, getData, delData, createData } = Threads;
        try {
            let dataThread = (await getData(threadID)).threadInfo;

            switch (logMessageType) {
                case "log:thread-admins": {
                    const targetID = logMessageData.TARGET_ID;
                    if (logMessageData.ADMIN_EVENT === "add_admin") {
                        dataThread.adminIDs.push({ id: targetID });
                    } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
                        dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id !== targetID);
                    }
                    logger(`Updated Admin List For Group: ${threadID}`, '[ UPDATE DATABASE ]');
                    await setData(threadID, { threadInfo: dataThread });
                    break;
                }
                
                case "log:thread-name": {
                    const newThreadName = logMessageData.name;
                    logger(`Updated Group Name For: ${threadID}`, '[ UPDATE DATABASE ]');
                    dataThread.threadName = newThreadName;
                    await setData(threadID, { threadInfo: dataThread });
                    break;
                }
                
                //<----optional section--->//
                /* case "log:subscribe": {
                    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        try {
                            require('./handleCreateDatabase.js');
                        } catch(e) {
                            console.log(e)
                        }
                        return;
                    }
                    break;
                }*/

                case 'log:unsubscribe': {
                    const leftParticipantFbId = logMessageData.leftParticipantFbId;
                    if (leftParticipantFbId === api.getCurrentUserID()) {
                        logger(`Deleting Group Data: ${threadID}`, '[ UPDATE DATABASE ]');
                        const index = global.data.allThreadID.indexOf(threadID);
                        if (index !== -1) {
                            global.data.allThreadID.splice(index, 1);
                            await delData(threadID);
                        }
                    } else {
                        const participantIndex = dataThread.participantIDs.indexOf(leftParticipantFbId);
                        if (participantIndex !== -1) {
                            dataThread.participantIDs.splice(participantIndex, 1);
                        }

                        const adminIndex = dataThread.adminIDs.findIndex(i => i.id === leftParticipantFbId);
                        if (adminIndex !== -1) {
                            dataThread.adminIDs.splice(adminIndex, 1);
                        }

                        logger(`Removing User Data: ${leftParticipantFbId} | From Group: ${threadID}`, '[ UPDATE DATABASE ]');
                        await setData(threadID, { threadInfo: dataThread });
                    }
                    break;
                }
            }
        } catch (error) {
            // console.log(`An error occurred while updating data: ${error}`);
        }
        return;
    };
};

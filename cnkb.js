const scriptName = "cnkb.js";

const kalingModule = require("kaling.js").Kakao();
const Kakao = new kalingModule;
Kakao.init('0cbf070cc46c70fe11cfe7b90cd93874');
Kakao.login("", "");

const Thread = java.lang.Thread;
const DB = DataBase;

const FOLPATH = "CNKB/";
const PLAYERPATH = FOLPATH + "players.json";
const CHATPATH = FOLPATH + "chats.json";
const NPCPATH = FOLPATH + "npcs.json";
const QUESTPATH = FOLPATH + "quests.json";
const ITEMPATH = FOLPATH + "items.json";
const ACHIEVEPATH = FOLPATH + "achieves.json";
const RESEARCHPATH = FOLPATH + "researches.json";
const VARPATH = FOLPATH + "vars.json";
const LOGPATH = FOLPATH + "Log/";

const FUNC = {
	loadDB: function () {
		var key1, key2, key3, key4;
		var value;
		var map;

		//플레이어 데이터 파싱
		var playerDatas = this.getDB(PLAYERPATH);
		var player;
		for (var playerData of playerDatas) {
			player = new Player(null, null, null, null, null, false);
			player.id = Number(playerData.id);
			player.nickName = String(playerData.nickName);
			player.name = String(playerData.name);
			player.image = Number(playerData.image);
			player.lastTime = Number(playerData.lastTime);
			player.recentRoom = player.room;
			player.coord = this.objToCoord(playerData.coord);
			player.nowTitle = String(playerData.nowTitle);
			player.money = Number(playerData.money);
			player.lv = Number(layer.lv);
			player.exp = Number(playerData.exp);
			player.sp = Number(playerData.sp);
			player.adv = Number(playerData.adv);
			player.ddosCheck = Number(playerData.ddosCheck);
			player.doing = Number(playerData.doing);
			player.nowChat = Number(playerData.nowChat);
			player.achieve = new Array(playerData.achieve);
			player.research = new Array(playerData.research);
			player.title = new Array(playerData.title);
			player.nowQuest = new Array(playerData.nowQuest);
			player.job = this.objToMap(playerData.job);
			player.resistStat = this.objToMap(playerData.resistStat);
			player.inventory = this.objToMap(playerData.inventory);
			player.equipped = this.objToMap(playerData.equipped);
			player.clearedQuest = this.objToMap(playerData.clearedQuest);
			player.closeRate = this.objToMap(playerData.closeRate);
			player.log = this.objToMap(playerData.log);
			player.type = this.objToMap(playerData.type);

			player.mainStat = new Map();
			for (var obj of playerData.mainStat) {
				key1 = String(obj);

				player.mainStat.set(key1, new Map());
				for (var stat2Map of obj.value) {
					key2 = Number(stat2Map.key);
					value = Number(stat2Map.value);

					player.mainStat.get(key1).set(key2, value);
				}
			}

			player.buff = new Map();
			for (var obj of playerData.buff) {
				key1 = Number(obj.key1);

				player.buff.set(key1, new Map());
				for (var buffMap of obj.value) {
					key2 = Number(buffMap.key);
					value = Number(buffMap.value);

					player.buff.get(key1).set(key2, value);
				}
			}

			VAR.players.set(player.id, player);
		}


		//채팅 데이터 파싱
		var chatDatas = this.getDB(CHATPATH);
		var chat;
		for (var chatData of chatDatas) {
			chat = new Chat(null, false);
			chat.id = Number(chatData.id);
			chat.pause = Number(chatData.pause);
			chat.quest = Number(chatData.quest);
			chat.money = Number(chatData.money);
			chat.teleport = this.objToCoord(chatData.teleport);
			chat.text = new Array(chatData.text);
			chat.wait = new Array(chatData.wait);
			chat.chat = this.objToMap(chatData.chat);
			chat.stat = this.objToMap(chatData.stat);
			chat.item = this.objToMap(chatData.item);

			VAR.chats.set(chat.id, chat);
		}


		//엔피시 데이터 파싱
		var npcDatas = this.getDB(NPCPATH);
		var npc;
		for (var npcData of npcDatas) {
			npc = new Npc(null, null, false);
			npc.id = Number(npcData.id);
			npc.name = String(npcData.name);
			npc.coord = this.objToCoord(npcData.coord);
			npc.job = this.objToMap(npcData.job);

			npc.chat = new Array();
			for (var chat of npcData.chat) {
				map = new Map();
				map.set("chat", Number(chat.chat));
				map.set("percent", Number(chat.percent));
				map.set("minLv", Number(chat.minLv));
				map.set("minCloseRate", Number(chat.minCloseRate));
				map.set("minStat", this.objToMap(chat.minStat));
				map.set("minQuest", this.objToMap(chat.minQuest));
				map.set("maxLv", Number(chat.maxLv));
				map.set("maxCloseRate", Number(chat.maxCloseRate));
				map.set("maxStat", this.objToMap(chat.maxStat));
				map.set("maxQuest", this.objToMap(chat.maxQuest));

				npc.chat.push(map);
			}

			npc.selling = new Map();
			for (var jobEnumMap of npcData.selling) {
				key1 = Number(jobEnumMap.key);

				npc.selling.set(key1, new Map());
				for (var jobMap of jobEnumMap.value) {
					key2 = Number(jobMap.key);

					npc.selling.get(key1).set(key2, new Map());
					for (var closeRateMap of jobMap.value) {
						key3 = Number(closeRateMap.key);

						npc.selling.get(key1).get(key2).set(key3, new Map());
						for (var itemMap of closeRateMap.value) {
							key4 = Number(itemMap.key);
							value = Number(itemMap.value);

							npc.selling.get(key1).get(key2).get(key3).set(key4, value);
						}
					}
				}
			}

			VAR.npcs.set(npc.id, npc);
		}


		//퀘스트 데이터 파싱
		var questDatas = this.getDB(QUESTPATH);
		var quest;
		for (var questData of questDatas) {
			quest = new Quest(null, null, false);
			quest.id = Number(questData.id);
			quest.name = String(questData.name);
			quest.isRepeatable = Boolean(questData.isRepeatable);
			quest.minLimitLv = Number(questData.minLimitLv);
			quest.maxLimitLv = Number(questData.maxLimitLv);
			quest.needMoney = Number(questData.needMoney);
			quest.needExp = Number(questData.needexp);
			quest.needAdv = Number(questData.needAdv);
			quest.rewardMoney = Number(questData.rewardMoney);
			quest.rewardExp = Number(questData.rewardExp);
			quest.rewardAdv = Number(questData.rewardAdv);
			quest.minLimitCloseRate = this.objToMap(questData.minLimitCloseRate);
			quest.maxLimitCloseRate = this.objToMap(questData.maxLimitCloseRate);
			quest.minLimitStat = this.objToMap(questData.minLimitStat);
			quest.maxLimitStat = this.objToMap(questData.maxLimitStat);
			quest.needItem = this.objToMap(questData.needItem);
			quest.needStat = this.objToMap(questData.needStat);
			quest.rewardItem = this.objToMap(questData.rewardItem);
			quest.rewardStat = this.objToMap(questData.rewardStat);
			quest.rewardCloseRate = this.objToMap(questData.rewardCloseRate);

			VAR.quests.set(quest.id, quest);
		}


		//아이템 데이터 파싱
		var itemDatas = this.getDB(ITEMPATH);
		var item, equipment;
		for (var itemData of itemDatas) {
			item = new Item(null, null, false);
			item.id = Number(itemData.id);
			item.name = String(itemData.name);
			item.description = String(itemData.description);
			item.handleLevel = Number(itemData.handleLevel);
			item.value = Number(itemData.value);
			item.isWeapon = false;

			item.recipe = new Array();
			for (var recipeMap of itemData.recipe) {
				key1 = Number(recipeMap.key);
				value = Number(recipeMap.value);

				map = new Map();
				map.set(key1, value);

				item.recipe.push(map);
			}

			//장비 데이터 파싱
			if (item.isWeapon) {
				equipment = new Equipment(null, null, null, null, false);

				equipment.id = item.id;
				equipment.name = item.name;
				equipment.description = item.description;
				equipment.handleLevel = item.handleLevel;
				equipment.value = item.value;
				equipment.isWeapon = true;
				equipment.recipe = item.recipe;
				equipment.eType = Number(itemData.eType);
				equipment.limitLv = Number(itemData.limitLv);
				equipment.maxReinforce = Number(itemData.maxReinforce);
				equipment.nowReinforce = Number(itemData.nowReinforce);
				equipment.lvDown = Number(itemData.lvDown);
				equipment.stat = this.objToMap(itemData.stat);
				equipment.limitStat = this.objToMap(itemData.limitStat);
				equipment.type = this.objToMap(itemData.type);
				equipment.reinforce = this.objToMap(itemData.reinforce);

				VAR.items.set(equipment.id, equipment);
			}

			else
				VAR.items.set(item.id, item);
		}


		//업적 데이터 파싱
		var achieveDatas = this.getDB(ACHIEVEPATH);
		var achieve;
		for (var achieveData of achieveDatas) {
			achieve = new Achieve(null, null, false);
			achieve.id = Number(achieveData.id);
			achieve.name = String(achieveData.name);
			achieve.limitLv = Number(achieveData.limitLv);
			achieve.rewardMoney = Number(achieveData.rewardMoney);
			achieve.rewardExp = Number(achieveData.rewardExp);
			achieve.rewardAdv = Number(achieveData.rewardAdv);
			achieve.limitStat = this.objToMap(achieveData.limitStat);
			achieve.limitCloseRate = this.objToMap(achieveData.limitCloseRate);
			achieve.otherLimit = this.objToMap(achieveData.otherLimit);
			achieve.rewardCloseRate = this.objToMap(achieveData.rewardCloseRate);
			achieve.rewardItem = this.objToMap(achieveData.rewardItem);

			VAR.achieves.set(achieve.id, achieve);
		}


		//연구 데이터 파싱
		var researchDatas = this.getDB(RESEARCHPATH);
		var research;
		for (var researchData of researchDatas) {
			research = new Research(null, null, false);
			research.id = Number(researchData.id);
			research.name = String(researchData.name);
			research.needMoney = Number(researchData.needMoney);
			research.limitLv = Number(researchData.limitLv);
			research.rewardExp = Number(researchData.rewardExp);
			research.needItem = this.objToMap(researchData.needItem);
			research.rewardItem = this.objToMap(researchData.rewardStat);

			VAR.researches.set(research.id, research);
		}


		//변수 데이터 파싱
		var varData = this.getDB(VARPATH);
		VAR.ddosTime = varData.ddosTime;
		VAR.rooms = varData.rooms;
		VAR.id = this.objToMap(varData.id);
		VAR.spGive = varData.spGive;
		VAR.expBoost = varData.expBoost;


		Api.makeNoti("Data Loaded", String(this.time()), 4);
	},

	saveDB: function () {
		var obj;
		var obj1, obj2, obj3;

		//플레이어 데이터 저장
		var playerDatas = new Array();
		var playerData;

		for (var player of VAR.players.values()) {
			playerData = new Object();

			playerData.id = player.id;
			playerData.nickName = player.nickName;
			playerData.name = player.name;
			playerData.image = player.image;
			playerData.lastTime = player.lastTime;
			playerData.recentRoom = player.room;
			playerData.coord = this.coordToObj(player.coord);
			playerData.nowTitle = player.nowTitle;
			playerData.money = player.money;
			playerData.lv = player.lv;
			playerData.exp = player.exp;
			playerData.sp = player.sp;
			playerData.adv = player.adv;
			playerData.ddosCheck = player.ddosCheck;
			playerData.doing = player.doing;
			playerData.nowChat = player.nowChat;
			playerData.achieve = player.achieve;
			playerData.research = player.research;
			playerData.title = player.title;
			playerData.nowQuest = player.nowQuest;
			playerData.job = this.mapToObj(player.job);
			playerData.resistStat = this.mapToObj(player.resistStat);
			playerData.inventory = this.mapToObj(player.inventory);
			playerData.equipped = this.mapToObj(player.equipped);
			playerData.clearedQuest = this.mapToObj(player.clearedQuest);
			playerData.closeRate = this.mapToObj(player.closeRate);
			playerData.log = this.mapToObj(player.log);
			playerData.type = this.mapToObj(player.type);

			playerData.mainStat = new Array();
			for (var [stat1Enum, stat2Map] of player.mainStat) {
				obj = new Object();
				obj.key = stat1Enum;
				obj.value = this.mapToObj(stat2Map);
				playerData.mainStat.push(obj);
			}

			playerData.buff = new Array();
			for (var [stat2Enum, buffMap] of player.buff) {
				obj = new Object();
				obj.key = stat2Enum;
				obj.value = this.mapToObj(buffMap);
				playerData.buff.push(obj);
			}

			playerDatas.push(playerData);
		}
		this.setDB(PLAYERPATH, JSON.stringify(playerDatas, null, "\t"));


		//채팅 데이터 저장
		var chatDatas = new Array();
		var chatData;

		for (var chat of VAR.chats.values()) {
			chatData = new Object();

			chatData.id = chat.id;
			chatData.pause = chat.pause;
			chatData.quest = chat.quest;
			chatData.money = chat.money;
			chatData.teleport = this.coordToObj(chat.teleport);
			chatData.text = chat.text;
			chatData.wait = chat.wait;
			chatData.chat = this.mapToObj(chat.chat);
			chatData.stat = this.mapToObj(chat.stat);
			chatData.item = this.mapToObj(chat.item);

			chatDatas.push(chatData);
		}
		this.setDB(CHATPATH, JSON.stringify(chatDatas, null, "\t"));


		//엔피시 데이터 저장
		var npcDatas = new Array();
		var npcData;

		for (var npc of VAR.npcs.values()) {
			npcData = new Object();

			npcData.id = npc.id;
			npcData.name = npc.name;
			npcData.coord = this.coordToObj(npc.coord);
			npcData.job = this.mapToObj(npc.job);

			npcData.chat = new Array();
			for (var chat of npc.chat) {
				obj = new Object();
				obj.chat = chat.get("chat");
				obj.percent = chat.get("percent");
				obj.minLv = chat.get("minLv");
				obj.minCloseRate = chat.get("minCloseRate");
				obj.minStat = this.mapToObj(chat.get("minStat"));
				obj.minQuest = this.mapToObj(chat.get("minQuest"));
				obj.maxLv = chat.get("maxLv");
				obj.maxCloseRate = chat.get("maxCloseRate");
				obj.maxStat = this.mapToObj(chat.get("maxStat"));
				obj.maxQuest = this.mapToObj(chat.get("maxQuest"));

				npcData.chat.push(obj);
			}

			npcData.selling = new Array();
			for (var [jobEnum, jobMap] of npc.selling) {
				obj1 = new Object();

				obj1.key = jobEnum;
				obj1.value = new Array();

				for (var [jobLv, closeRateMap] of jobMap) {
					obj2 = new Object();

					obj2.key = jobLv;
					obj2.value = new Array();

					for (var [closeRate, itemMap] of closeRateMap) {
						obj3 = new Object();

						obj3.key = closeRate;
						obj3.value = this.mapToObj(itemMap);

						obj2.value.push(obj3);
					}

					obj1.value.push(obj1);
				}

				npcData.selling.push(obj1);
			}
		}
		this.setDB(NPCPATH, JSON.stringify(npcDatas, null, "\t"));


		//퀘스트 데이터 저장
		var questDatas = new Array();
		var questData;

		for (var quest of VAR.quests) {
			questData = new Object();

			questData.id = quest.id;
			questData.name = quest.name;
			questData.isRepeatable = quest.isRepeatable;
			questData.minLimitLv = quest.minLimitLv;
			questData.maxLimitLv = quest.maxLimitLv;
			questData.needMoney = quest.needMoney;
			questData.needExp = quest.needexp;
			questData.needAdv = quest.needAdv;
			questData.rewardMoney = quest.rewardMoney;
			questData.rewardExp = quest.rewardExp;
			questData.rewardAdv = quest.rewardAdv;
			questData.minLimitCloseRate = this.mapToObj(quest.minLimitCloseRate);
			questData.maxLimitCloseRate = this.mapToObj(quest.maxLimitCloseRate);
			questData.minLimitStat = this.mapToObj(quest.minLimitStat);
			questData.maxLimitStat = this.mapToObj(quest.maxLimitStat);
			questData.needItem = this.mapToObj(quest.needItem);
			questData.needStat = this.mapToObj(quest.needStat);
			questData.rewardItem = this.mapToObj(quest.rewardItem);
			questData.rewardStat = this.mapToObj(quest.rewardStat);
			questData.rewardCloseRate = this.mapToObj(quest.rewardCloseRate);

			questDatas.push(questData);
		}
		this.setDB(QUESTPATH, JSON.stringify(questDatas, null, "\t"));


		//아이템 데이터 저장
		var itemDatas = new Array();
		var itemData;

		for (var item of VAR.items.values()) {
			itemData = new Object();

			itemData.id = item.id;
			itemData.name = item.name;
			itemData.description = item.description;
			itemData.handleLevel = item.handleLevel;
			itemData.value = item.value;
			itemData.isWeapon = item.isWeapon;

			itemData.recipe = new Array();
			for (var recipeMap of itemData.recipe) {
				for (var [itemId, itemCount] of recipeMap) {
					obj = new Object();
					obj.key = itemId;
					obj.value = itemCount;
					itemData.recipe.push(obj);
				}
			}

			//장비 데이터 저장
			if (item.isWeapon) {
				itemData.eType = item.eType;
				itemData.limitLv = item.limitLv;
				itemData.maxReinforce = item.maxReinforce;
				itemData.nowReinforce = item.nowReinforce;
				itemData.lvDown = item.lvDown;
				itemData.stat = this.mapToObj(item.stat);
				itemData.limitStat = this.mapToObj(item.limitStat);
				itemData.type = this.mapToObj(item.type);
				itemData.reinforce = this.mapToObj(item.reinforce);
			}

			itemDatas.push(itemData);
		}
		this.setDB(ITEMPATH, JSON.stringify(itemDatas, null, "\t"));


		//업적 데이터 저장
		var achieveDatas = new Array();
		var achieveData;

		for (var achieve of VAR.achieves.values()) {
			achieveData = new Object();

			achieveData.id = achieve.id;
			achieveData.name = achieve.name;
			achieveData.limitLv = achieve.limitLv;
			achieveData.rewardMoney = achieve.rewardMoney;
			achieveData.rewardExp = achieve.rewardExp;
			achieveData.rewardAdv = achieve.rewardAdv;
			achieveData.limitStat = this.mapToObj(achieve.limitStat);
			achieveData.limitCloseRate = this.mapToObj(achieve.limitCloseRate);
			achieveData.otherLimit = this.mapToObj(achieve.otherLimit);
			achieveData.rewardCloseRate = this.mapToObj(achieve.rewardCloseRate);
			achieveData.rewardItem = this.mapToObj(achieve.rewardItem);

			achieveDatas.push(achieveData);
		}
		this.setDB(ACHIEVEPATH, JSON.stringify(achieveDatas, null, "\t"));


		//연구 데이터 저장
		var researchDatas = new Array();
		var researchData;

		for (var research of VAR.researches.values()) {
			researchData = new Object();

			researchData.id = research.id;
			researchData.name = research.name;
			researchData.needMoney = research.needMoney;
			researchData.limitLv = research.limitLv;
			researchData.rewardExp = research.rewardExp;
			researchData.needItem = this.mapToObj(research.needItem);
			researchData.rewardItem = this.mapToObj(research.rewardStat);

			researchDatas.push(researchData);
		}
		this.setDB(RESEARCHPATH, JSON.stringify(researchDatas, null, "\t"));


		//변수 데이터 저장
		var varData = new Object();
		varData.ddosTime = VAR.ddosTime;
		varData.rooms = VAR.rooms;
		varData.id = this.mapToObj(VAR.id);
		varData.spGive = VAR.spGive;
		varData.expBoost = VAR.expBoost;
		this.setDB(VARPATH, JSON.stringify(varData, null, "\t"));


		Api.makeNoti("Data Saved", String(this.time()), 5);
	},

	getDB: function (path) {
		return JSON.parse(DB.getDataBase(path));
	},

	setDB: function (path, data) {
		DB.setDataBase(path, data);
	},

	saveLog: function () {
		FUNC.setDB(LOGPATH + String(this.time()) + ".txt", VAR.log);
	},

	log: function (logData, logType) {
		logType = typeof logType !== "undefined" ? logType : ENUM.LOG.info;

		switch (logType) {
			case ENUM.LOG.info:
				VAR.log += "[info]";
				break;
			case ENUM.LOG.warning:
				VAR.log += "[warn]";
				break;
			case ENUM.LOG.error:
				VAR.log += "[error]";
				break;
		}

		try {
			new Packages.java.io.FileInputStream("err");
		} catch (e) {
			VAR.log += " (" + String(e.rhinoException.getScriptStack()[1]) + ") - " + logData + "\n";
		}

		VAR.logCount++;
		if (VAR.logCount >= 100) {
			this.saveLog();
			Api.makeNoti("Log Saved", String(this.time()), 2);
			VAR.log = "";
		}
	},

	checkType: function (func, variable) {
		var funcName = this.getFuncName(func);
		var varFuncName = variable.constructor.name;

		if (funcName !== varFuncName) {
			this.log("Type Error - (func : " + funcName + ", variable : " + varFuncName + ")", ENUM.LOG.error);
			return null;
		}

		return variable;
	},

	checkNaN: function (variable, min, max) {
		if (isNaN(parseInt(variable, 10)) || (typeof min !== "undefined" && variable < min) || (typeof max !== "undefined" && variable > max)) {
			this.log("NaN Error - (variable : " + variable + ")", ENUM.LOG.error);
			return null;
		}

		return Math.round(Number(varialbe));
	},

	getId: function (idType) {
		var value = VAR.id.get(idType);

		if (typeof value !== "undefined") {
			VAR.id.set(idType, value + 1);
			return value;
		}

		else {
			VAR.id.set(idType, 2);
			return 1;
		}
	},

	random: function (min, max) {
		return (Math.random() * (max - min)) + min;
	},

	getFuncName: function (func) {
		return String(func).substr(9).split("(")[0]
	},

	check: function (original, comparing, checking, ignore, setZero) {	//checking이 small이라면 compare이 original에 비해 더 작을 때 true
		var temp1 = this.checkType(Map, original);
		var temp2 = this.checkType(Map, comparing);

		if (temp1 === null || temp2 === null)
			return false;

		ignore = typeof ignore !== "undefined" ? ignore : true;
		setZero = typeof setZero !== "undefined" ? setZero : false;

		for (var [k, v] of original) {
			compareValue = comparing.get(k);

			if (typeof compareValue === "undefined") {
				if (!ignore) {
					if (!setZero)
						return false;
					else
						compareValue = 0;
				}

				else
					continue;
			}

			if (v > compareValue)
				compare = ENUM.CHECKING.small;
			else if (v < compareValue)
				compare = ENUM.CHECKING.big;
			else
				continue;

			if (compare !== checking)
				return false;
		}

		return true;
	},

	reply: function (playerId, text, more) {
		var temp = this.checkNaN(playerId, 1, VAR.players.size);

		if (temp !== null) {
			var player = VAR.players.get(temp);
			var str = player.getFullName() + "\n" + text;
			if (typeof more !== "undefined")
				str += VAR.all + "----------\n" + more;

			Api.replyRoom(player.recentRoom, str.trim(), true);
		}
	},

	system: function (room, text, more) {
		var str = text;
		if (typeof more !== "undefined")
			str += VAR.all + "----------\n" + more;
		Api.replyRoom(room, str.trim(), true);
	},

	systemAll: function (text, more) {
		var str = text;
		if (typeof more !== "undefined")
			str += VAR.all + "----------\n" + more;

		for (var r of VAR.rooms)
			Api.replyRoom(r, str.trim(), true);
	},

	time: function () {
		return Date.now();
	},

	sleep: function (millis) {
		Thread.sleep(millis);
	},

	formatImage: function (ImageDB) {
		return Number(String(ImageDB.getProfileImage()).hashcode());
	},

	findValue: function (array, value) {
		return array.find(element => JSON.stringify(element) === JSON.stringify(value));
	},

	removeValue: function (array, value) {
		var index = array.findIndex(element => JSON.stringify(element) === JSON.stringify(value));
		array.splice(index, 1);
	},

	findPlayer: function (sender, ImageDB) {
		var image = this.formatImage(ImageDB);

		for (var player of VAR.players.values()) {
			if (player.sender === sender && player.image === image)
				return player;
		}

		return undefined;
	},

	mapToObj: function (map) {
		var arr = new Array();
		var obj;

		for (var [k, v] of map) {
			obj = new Object();
			obj.key = k;
			obj.value = v;
			arr.push(obj);
		}

		return arr;
	},

	coordToObj: function (coord) {
		var obj = new Object();
		obj.x = coord.x;
		obj.y = coord.y;
		return obj;
	},

	objToMap: function (obj) {
		var map = new Map();
		for (var element of arr)
			map.set(element.key, element.value);
		return map;
	},

	objToCoord: function (obj) {
		return new Coordinate(obj.x, obj.y);
	}
};

const ENUM = {
	"LOG": {
		"info": 0,
		"warning": 1,
		"error": 2
	},
	"CHECKING": {
		"small": 0,
		"big": 1
	},
	"STAT1": {
		"basicStat": 0,			//전직 떄에만 가변, 기본 불변
		"levelStat": 1,			//SP로 증가 가능, 감소 불가능
		"equipStat": 2,			//장비 변경 시 증감
		"buffStat": 3,			//버프로 얻는 스텟
		"quickStat": 4,			//일시적으로 저장되는(버프 제외) 스텟
		"actStat": 5,			//활동으로 얻는 스텟
		"increStat": 6,			//레벨 스텟 + 이큅 스텟 + 퀵 스텟 + 액트 스텟
		"totalStat": 7,			//베이직 스텟 + 인크리 스텟
	},
	"STAT2": {
		"maxhp": 0,				//최대 체력
		"hp": 1,				//현재 체력
		"maxmn": 2,				//최대 마나
		"mn": 3,				//현재 마나
		"maxeg": 4,				//최대 활동력
		"eg": 5,				//현재 활동력
		"atk": 6,				//공격력
		"matk": 7,				//마법 공격력
		"def": 8,				//방어력
		"mdef": 9,				//마법 방어력
		"bre": 10,				//관통력
		"mbre": 11,				//마법 관통력
		"dra": 12,				//흡수력
		"mdra": 13,				//마법 흡수력
		"cd": 14,				//쿨감
		"spd": 15,				//이속
		"eva": 16,				//회피
		"acc": 17,				//정확성
		"max": 17
	},
	"ETYPE": {
		"helmet": 0,			//투구
		"chestplate": 1,		//갑옷(상의)
		"leggings": 2,			//갑옷(하의)
		"shoes": 3,				//신발
		"ring": 4,				//반지
		"earring": 5,			//귀걸이
		"necklace": 6,			//목걸이
		"gem1": 7,				//보석1
		"gem2": 8,				//보석2
		"gem3": 9,				//보석3
		"heartgem": 10,			//보석 심장 - 보석 1~3이 모두 있을 시, 보석 1~3의 스텟에 영향을 받아 자동 생성 됨
		"amulet": 11,			//부적 - 특별한 효과들이 담겨있다
	},
	"TYPE": {
		"fire": 0,				//도트데미지 - 일정 시간 후 자동 해제
		"poison": 1,			//도트데미지 - 기본 영구 지속
		"grass": 2,				//회복
		"water": 3,				//디버프 해제
		"ice": 4,				//기절
		"dirt": 5,				//데미지 감소
		"stone": 6,				//데미지 반사
		"iron": 7,				//추가 물리 데미지
		"energy": 8,			//추가 마법 데미지
		"dark": 9,				//침묵
		"mirror": 10,			//디버프 반사
		"max": 10
	},
	"JOB": {
		"merchant": 0,			//일반 상인
		"magicMerchant": 1,	//마법 상인
		"dark_Dealer": 2,		//암흑 거래상
		"wanderingTrader": 3,	//떠돌이 상인
		"blacksmith": 4,		//대장장이
		"magicBlacksmith": 5,	//마법 대장장이
		"farmer": 6,			//농부
		"coachman": 7,			//마부
		"warrior": 8,			//전사
		"magician": 9,			//마법사
		"tanker": 10,			//탱커
		"archer": 11,			//궁수
		"priest": 12,			//성직자
		"dark_priest": 13,		//암흑 성직자
	},
	"WAIT_RESPONSE": {
		"nothing": 0,			//대답 없음
		"yes": 1,				//"예" 또는 "Y" 또는 "y" 또는 "ㅇ" 또는 "dd"
		"no": 2,				//"아니오" 또는 "아니요" 또는 "N" 또는 "n" 또는 "ㄴ" 또는 "ss"
		"number": 3,			//숫자 형태 전부
		"anything": 4,			//아무 채팅
	},
	"DOING": {
		"none": 0,				//IDLE 상태
		"move": 1,				//이동
		"buy": 2,				//구매
		"chat": 3,				//NPC와 대화
		"fight": 4,				//전투
		"explore": 5,			//탐험/수색
		"mine": 6,				//광질 및 다양한 채집
		"reinforce": 7,			//강화, 마법부여 등
	},
	"ID": {
		"player": 0,
		"chat": 1,
		"npc": 2,
		"quest": 3,
		"item": 4,
		"achieve": 5,
		"research": 6
	},
	"LOGDATA": {
		"chat": 0,
		"npcChat": 1,
		"questReceived": 2,
		"questCleared": 3,
		"maxMoney": 4,
		"maxPayment": 5,
		"moveDistance": 6,
		"mined": 7,
		"ate": 8,
		"bought": 9,
		"gottenItem": 10,
		"usedItem": 11,
		"reinforceTried": 12,
		// "totalExp": 13,
		"buffReceived": 14,
		"maxCloseRate": 15,
		"totalCloseRate": 16,
		"statUpdated": 17,
		"emoteSent": 18,
		"createdTime": 19,
		// "lastTime": 20,
		"playedDay": 21
	}
};

const VAR = {
	"log": "",
	"logCount": 0,
	"msgCount": 0,
	"ddosTime": 1000,
	"rooms": new Array(),
	"players": new Map(),
	"chats": new Map(),
	"npcs": new Map(),
	"quests": new Map(),
	"items": new Map(),
	"achieves": new Map(),
	"researches": new Map(),
	"id": new Map(),
	"all": "\n\n" + ("\u200b".repeat(500)),
	"max": 999999999,
	"spGive": 5,
	"expBoost": 1
};

function Coordinate(x, y) {

	if (typeof x !== "undefined")
		this.x = x;
	else
		this.x = 0;

	if (typeof y !== "undefined")
		this.y = y;
	else
		this.y = 0;

	this.setX = function (x) {
		var temp = FUNC.checkNaN(x, 0);
		if (temp !== null) this.x = temp;
	}
	this.setY = function (y) {
		var temp = FUNC.checkNaN(y, 0);
		if (temp !== null) this.y = temp;
	}

	this.addX = function (x) {
		var temp = FUNC.checkNaN(x);
		if (temp !== null) this.setX(this.x + temp);
	}
	this.addY = function (y) {
		var temp = FUNC.checkNaN(y);
		if (temp !== null) this.setY(this.y + temp);
	}
}

function Chat(chat, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof chat === "undefined") {
			this.id = FUNC.getId(ENUM.id);
			this.pause = 0;
			this.quest = 0;
			this.money = 0;
			this.teleport = null;
			this.text = new Array();
			this.wait = new Array();
			this.chat = new Map();
			this.stat = new Map();
			this.item = new Map();

			this.wait.push(ENUM.WAIT_RESPONSE.nothing);

			FUNC.log("Created New Chat - (id : " + this.id + ")");
		}

		else {
			if (FUNC.checkType(Chat, chat) === null) {
				FUNC.log("Chat Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = chat.id;
			this.pause = chat.pause;
			this.quest = chat.quest;
			this.money = chat.money
			this.teleport = chat.teleport
			this.text = chat.text;
			this.wait = chat.wait;
			this.stat = chat.stat;
			this.item = chat.item;

			FUNC.log("Copied Chat - (id : " + this.id + ")");
		}

		VAR.chats.set(this.id, this);
	}

	this.getChat = function (response) {
		var temp = FUNC.checkType(String, response);
		return this.chat.get(temp);
	}
	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.stat.get(temp);
	}
	this.getItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.item.get(temp);
	}

	this.setPause = function (pause) {
		var temp = FUNC.checkNaN(pause, 0);
		if (temp !== null) this.pause = temp;
	}
	this.setQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);
		if (temp !== null) this.quest = temp;
	}
	this.setMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.money = temp;
	}
	this.setTeleport = function (x, y) {
		if (this.teleport === null)
			this.teleport = new Coordinate(x, y);

		else {
			var temp1 = FUNC.checkNaN(x, 0);
			var temp2 = FUNC.checkNaN(y, 0);

			if (temp1 !== null && temp2 !== null) {
				this.teleport.setX(temp1);
				this.teleport.setY(temp2);
			}
		}
	}
	this.setChat = function (response, chatId, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkType(String, response);
		var temp2 = FUNC.checkNaN(chatId, 1, VAR.chats.size);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getChat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.chat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setChat Error", ENUM.LOG.error);
					return;
				}
			}

			this.chat.set(temp1, temp2);
		}
	}
	this.setStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.stat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.stat.set(temp1, temp2);
		}
	}
	this.setItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.item.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setItem Error", ENUM.LOG.error);
					return;
				}
			}

			this.item.set(temp1, temp2);
		}
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setMoney(this.money + money);
	}
	this.addText = function (text) {
		var temp = FUNC.checkType(String, text);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.text, temp) === "undefined")
				this.text.push(temp);
			else
				FUNC.log("addText Error", ENUM.LOG.error);
		}
	}
	this.addWait = function (waitEnum) {
		var temp = FUNC.checkNaN(waitEnum);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.wait, temp) === "undefined")
				this.wait.push(temp);
			else
				FUNC.log("addWait Error", ENUM.LOG.error);
		}
	}
	this.addStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined")
				this.setStat(temp1, temp2, true);
			else
				this.setStat(temp1, value + temp2, true);
		}
	}
	this.addItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getItem(temp1);

			if (typeof value === "undefined")
				this.setItem(temp1, temp2, true);
			else
				this.setItem(temp1, value + temp2, true);
		}
	}
}

function Npc(name, npc, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof npc === "undefined") {
			this.id = FUNC.getId(ENUM.ID.npc);
			this.name = name;
			this.coord = new Coordinate();
			this.chat = new Array();
			this.job = new Map();
			this.selling = new Map();

			FUNC.log("Created New Npc - (id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Npc, chat) === null) {
				FUNC.log("Npc Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = npc.id;
			this.name = npc.name;
			this.coord = npc.coord;
			this.job = npc.get
			this.chat = npc.chat;
			this.selling = npc.selling;

			FUNC.log("Copied Chat - (id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.npcs.set(this.id, this);
	}

	this.getAvailableChat = function (playerId) {
		var output = new Array();
		var temp1 = FUNC.checkNaN(playerId, 1, VAR.players.size);

		if (temp1 !== null) {
			var player = VAR.players.get(temp1);
			var lv = player.lv;
			var closeRate = player.getCloseRate(this.id);
			var stat = player.mainStat.get(ENUM.STAT1.totalStat);
			var quest = player.clearedQuest;

			for (var c of this.chat) {
				if (c.get("minLv") <= lv && c.get("maxLv") >= lv &&
					c.get("minCloseRate") <= closeRate && c.get("maxCloseRate") >= closeRate &&
					FUNC.check(c.get("minStat"), stat, ENUM.CHECKING.big, false, true) &&
					FUNC.check(c.get("maxStat"), stat, ENUM.CHECKING.small, false, true) &&
					FUNC.check(c.get("minQuest"), quest, ENUM.CHECKING.big, false, true) &&
					FUNC.check(c.get("maxQuest"), quest, ENUM.CHECKING.small, false, true))
					output.push(c.get("chat"));
			}
		}

		return output;
	}
	this.getAvailableSelling = function (playerId, jobEnum) {
		var output = new Map();
		var temp1 = FUNC.checkNaN(playerId, 1, VAR.players.size);
		var temp2 = FUNC.checkNaN(jobEnum);

		if (temp1 !== null && temp2 !== null) {
			var map = this.selling.get(temp2);
			var player = VAR.players.get(temp1);
			var closeRate = player.getCloseRate(this.id);
			var jobLv = this.getJob(temp2);
			var value;

			for (var [jobLv, closeRateMap] of map) {
				if (jobLv <= jobLv) {
					for (var [closeRate, itemMap] of closeRateMap) {
						if (closeRate <= closeRate) {
							for (var [itemId, itemCount] of itemMap) {
								value = output.get(itemId);

								if (typeof value === "undefined") {
									if (itemCount !== -1)
										output.set(itemId, itemCount);
									else
										output.set(itemId, VAR.max);
								}

								else if (value < VAR.max)
									output.set(itemId, value + itemCount);
							}
						}
					}
				}
			}
		}

		return output;
	}

	this.getChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, 1, VAR.chats.size);

		if (temp !== null) {
			for (var c of this.chat) {
				if (c.get("chat") === temp)
					return c;
			}
		}

		return undefined;
	}
	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getSelling = function (jobEnum, jobLv, minCloseRate, itemId) {
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, 0, 10000);
		var temp4 = FUNC.checkNaN(itemId, 1, VAR.items.size);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && this.selling.has(temp1) &&
			this.selling.get(temp1).has(temp2) && this.selling.get(temp1).get(temp2).has(temp3))
			return this.selling.get(temp1).get(temp2).get(temp3).get(temp4);

		return undefined;
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setCoord = function (x, y) {
		var temp1 = FUNC.checkNaN(x, 0);
		var temp2 = FUNC.checkNaN(y, 0);

		if (temp1 !== null && temp2 !== null) {
			this.coord.setX(temp1);
			this.coord.setY(temp2);
		}
	}
	this.setJob = function (jobEnum, jobLv, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getJob(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.job.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setJob Error", ENUM.LOG.error);
					return;
				}
			}

			this.job.set(temp1, temp2);
		}
	}
	this.setSelling = function (jobEnum, jobLv, minCloseRate, itemId, itemCount, ignore) {
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp5 = FUNC.checkNaN(itemCount, -1, VAR.max);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null) {
			if (!this.selling.has(temp1))
				this.selling.set(temp1, new Map());
			if (!this.selling.get(temp1).has(temp2))
				this.selling.get(temp1).set(temp2, new Map());
			if (!this.selling.get(temp1).get(temp2).has(temp3))
				this.selling.get(temp1).get(temp2).set(temp3, new Map());

			if (typeof this.selling.get(temp1).get(temp2).get(temp3).get(temp4) !== "undefined") {
				if (temp5 === 0) {
					this.selling.get(temp1).get(temp2).get(temp3).delete(temp4);
					return;
				}

				if (!ignore) {
					FUNC.log("setSelling Error", ENUM.LOG.error);
					return;
				}
			}

			this.selling.get(temp1).get(temp2).get(temp3).set(temp4, temp5);
		}
	}

	this.addChat = function (chatId, percent, minLv, minCloseRate, minStat, minQuest, maxLv, maxCloseRate, maxStat, maxQuest) {
		var temp1 = FUNC.checkNaN(chatId, 1, VAR.chats.size);
		var temp2 = FUNC.checkNaN(percent, -1);
		var temp3 = FUNC.checkNaN(minLv, 1, 999);
		var temp4 = FUNC.checkNaN(minCloseRate, 1, 10000);
		var temp5 = FUNC.checkType(Map, minStat);
		var temp6 = FUNC.checkType(Map, minQuest);
		var temp7 = FUNC.checkNaN(maxLv, 1, 999);
		var temp8 = FUNC.checkNaN(maxCloseRate, 1, 10000);
		var temp9 = FUNC.checkType(Map, maxStat);
		var temp10 = FUNC.checkType(Map, maxQuest);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null &&
			temp6 !== null && temp7 !== null && temp8 !== null && temp9 !== null && temp10 !== null &&
			temp3 <= temp7 && temp4 <= temp8 && FUNC.check(temp5, temp9, ENUM.CHECKING.big) &&
			FUNC.check(temp6, temp10, ENUM.CHECKING.big)) {
			var map = new Map();
			map.set("chat", temp1);
			map.set("percent", temp2);
			map.set("minLv", temp3);
			map.set("minCloseRate", temp4);
			map.set("minStat", temp5);
			map.set("minQuest", temp6);
			map.set("maxLv", temp7);
			map.set("maxCloseRate", temp8);
			map.set("maxStat", temp9);
			map.set("maxQuest", temp10);

			if (typeof FUNC.findValue(this.chat, map) === "undefined")
				this.chat.push(map);
			else
				FUNC.log("addChat Warning", ENUM.LOG.warning);
		}
	}
	this.addJob = function (jobEnum, jobLv) {
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getJob(temp1);

			if (typeof value === "undefined")
				this.setJob(temp1, temp2, true);
			else
				this.setJob(temp1, value + temp2, true);
		}
	}
	this.addSelling = function (jobEnum, jobLv, minCloseRate, itemId, itemCount) {
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp5 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null) {
			for (var i = 0; i < this.selling; i++) {
				if (this.selling[i].percent === -1) {
					FUNC.log("-1 percent already exists", ENUM.LOG.error);
					return;
				}
			}

			var value = this.getSelling(temp1, temp2, temp3, temp4);

			if (typeof value === "undefined")
				this.setSelling(temp1, temp2, temp3, temp4, temp5, true);
			else
				this.setSelling(temp1, temp2, temp3, temp4, value + temp5, true);
		}
	}
}

function Quest(name, quest, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof quest !== "undefined") {
			this.id = FUNC.getId(ENUM.ID.quest);
			this.name = name;
			this.isRepeatable = false;
			this.minLimitLv = 1;
			this.maxLimitLv = 999;
			this.needMoney = 0;
			this.needExp = 0;
			this.needAdv = 0;
			this.rewardExp = 0;
			this.rewardAdv = 0;
			this.rewardMoney = 0;
			this.minLimitCloseRate = new Map();
			this.maxLimitCloseRate = new Map();
			this.minLimitStat = new Map();
			this.maxLimitStat = new Map();
			this.needItem = new Map();
			this.needStat = new Map();
			this.rewardItem = new Map();
			this.rewardStat = new Map();
			this.rewardCloseRate = new Map();

			FUNC.log("Created New Quest - (id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Quest, chat) === null) {
				FUNC.log("Quest Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = quest.id;
			this.name = quest.name;
			this.isRepeatable = quest.isRepeatable;
			this.minLimitLv = quest.minLimitLv;
			this.maxLimitLv = quest.maxLimitLv;
			this.needMoney = quest.needMoney;
			this.needExp = quest.needExp;
			this.needAdv = quest.needAdv;
			this.rewardExp = quest.rewardExp;
			this.rewardAdv = quest.rewardAdv;
			this.rewardMoney = quest.rewardMoney;
			this.minLimitCloseRate = quest.minLimitCloseRate;
			this.maxLimitCloseRate = quest.maxLimitCloseRate;
			this.minLimitStat = quest.minLimitStat;
			this.maxLimitStat = quest.minLimitStat;
			this.needItem = quest.needItem;
			this.needStat = quest.needStat
			this.rewardItem = quest.rewardItem;
			this.rewardStat = quest.rewardStat;
			this.rewardCloseRate = quest.rewardCloseRate;

			FUNC.log("Copied Quest - (id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.quests.set(this.id, this);
	}

	this.getMinLimitCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.minLimitCloseRate.get(temp);
	}
	this.getMaxLimitCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.maxLimitCloseRate.get(temp);
	}
	this.getMinLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.minLimitStat.get(temp);
	}
	this.getMaxLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.minLimitStat.get(temp);
	}
	this.getNeedItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.needItem.get(temp);
	}
	this.getNeedStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, 1);
		return this.minLimitStat.get(temp);
	}
	this.getRewardItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.rewardItem.get(temp);
	}
	this.getRewardStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.rewardStat.get(temp);
	}
	this.getRewardCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.rewardCloseRate.get(temp);
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setIsRepeatable = function (isRepeatable) {
		var temp = FUNC.checkType(Boolean, isRepeatable);
		if (temp !== null) this.isRepeatable = temp;
	}
	this.setMinLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 999);
		if (temp !== null && temp <= this.maxLimitLv) this.minLimitLv = temp;
	}
	this.setMaxLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 999);
		if (temp !== null && temp >= this.minLimitLv) this.maxLimitLv = temp;
	}
	this.setNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money, 0);
		if (temp !== null) this.needMoney = temp;
	}
	this.setNeedExp = function (exp) {
		var temp = FUNC.checkNaN(exp, 0);
		if (temp !== null) this.needExp = temp;
	}
	this.setNeedAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, 0);
		if (temp !== null) this.needAdv = temp;
	}
	this.setRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp);
		if (temp !== null) this.rewardExp = temp;
	}
	this.setRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.rewardAdv = temp;
	}
	this.setRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.rewardMoney = temp;
	}
	this.setMinLimitCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.minLimitCloseRate.delete(temp1);
					return;
				}

				if (temp2 > value || !ignore)
					return;
			}

			this.minLimitCloseRate.set(temp1, temp2);
		}
	}
	this.setMaxLimitCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.maxLimitCloseRate.delete(temp1);
					return;
				}

				if (temp2 < value || !ignore)
					return;
			}

			this.maxLimitCloseRate.set(temp1, temp2);
		}
	}
	this.setMinLimitStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.minLimitStat.delete(temp1);
					return;
				}

				if (temp2 > value || !ignore)
					return;
			}

			this.minLimitStat.set(temp1, temp2);
		}
	}
	this.setMaxLimitStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.maxLimitStat.delete(temp1);
					return;
				}

				if (temp2 > value || !ignore)
					return;
			}

			this.maxLimitStat.set(temp1, temp2);
		}
	}
	this.setNeedItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1);
		var temp2 = FUNC.checkNaN(itemCount, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.needItem.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setNeedItem Error", ENUM.LOG.error);
					return;
				}
			}

			this.needItem.set(temp1, temp2);
		}
	}
	this.setNeedStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.needStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setNeedStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.needStat.set(temp1, temp2);
		}
	}
	this.setRewardItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardItem.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardItem Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardItem.set(temp1, temp2);
		}
	}
	this.setRewardStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardStat.set(temp1, temp2);
		}
	}
	this.setRewardCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(closeRate, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardCloseRate.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardCloseRate Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardCloseRate.set(temp1, temp2);
		}
	}

	this.addMinLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv);
		if (temp !== null) this.setMinLimitLv(value);
	}
	this.addMaxLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv);
		if (temp !== null) this.maxLimitLv(value);
	}
	this.addNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setNeedMoney(this.needMoney + temp);
	}
	this.addNeedExp = function (exp) {
		var temp = FUNC.checkNaN(exp);
		if (temp !== null) this.setNeedExp(this.needExp + temp);
	}
	this.addNeedAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.setNeedAdv(this.needMoney + temp);
	}
	this.addRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.setRewardAdv(this.rewardAdv + temp);
	}
	this.addRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setRewardMoney(this.rewardMoney + temp);
	}
	this.addMinLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value === "undefined")
				this.setMinLimitCloseRate(temp1, temp2, true);
			else
				this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value === "undefined")
				this.setMaxLimitCloseRate(temp1, temp2, true);
			else
				this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMinLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);

			if (typeof value === "undefined")
				this.setMinLimitStat(temp1, temp2, true);
			else
				this.setMinLimitStat(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);

			if (typeof value === "undefined")
				this.setMaxLimitStat(temp1, temp2, true);
			else
				this.setMaxLimitStat(temp1, value + temp2, true);
		}
	}
	this.addNeedItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);

			if (typeof value === "undefined")
				this.setNeedItem(temp1, temp2, true);
			else
				this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addNeedStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedStat(temp1);

			if (typeof value === "undefined")
				this.setNeedStat(temp1, temp2, true);
			else
				this.setNeedStat(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);

			if (typeof value === "undefined")
				this.setRewardItem(temp1, temp2, true);
			else
				this.setRewardItem(temp1, value + temp2, true);
		}
	}
	this.addRewardStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);

			if (typeof value === "undefined")
				this.setRewardStat(temp1, temp2, true);
			else
				this.setRewardStat(temp1, value + temp2, true);
		}
	}
	this.addRewardCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardCloseRate(temp1);

			if (typeof value === "undefined")
				this.setRewardCloseRate(temp1, temp2, true);
			else
				this.setRewardCloseRate(temp1, value + temp2, true);
		}
	}
}

function Item(name, item, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof item === "undefined") {
			this.id = FUNC.getId(ENUM.ID.item);
			this.name = name;
			this.description = "";
			this.handleLevel = 1;
			this.value = -1;
			this.isWeapon = false;
			this.recipe = new Array();

			FUNC.log("Created New Item(id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Item, chat) === null) {
				FUNC.log("Item Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = item.id;
			this.name = item.name;
			this.description = item.description;
			this.handleLevel = item.handleLevel;
			this.value = item.value;
			this.isWeapon = false;
			this.recipe = item.recipe;

			FUNC.log("Copied Item(id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.items.set(this.id, this);
	}

	//[★★☆] "테스트 수정구슬""
	this.getFullName = function () {
		var str = "[";

		for (var i = 0; i < this.handleLevel / 2; i++)
			str += c;
		str += this.handleLevel % 2 === 0 ? "" : "☆";

		str += "] \"" + this.name + "\"";
		return str;
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setDescription = function (description) {
		var temp = FUNC.checkType(String, description);
		if (temp !== null) this.description = temp;
	}
	this.setHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel, 1, 10);
		if (temp !== null) this.handleLevel = temp;
	}
	this.setValue = function (value) {
		var temp = FUNC.checkNaN(value);
		if (temp !== null) this.value = temp;
	}

	this.addHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel);
		if (temp !== null) this.setHandleLevel(this.handleLevel + temp);
	}
	this.addValue = function (value) {
		var temp = FUNC.checkNaN(value);
		if (temp !== null) this.setValue(this.value + temp);
	}
	this.addRecipe = function (recipe) {
		var temp = FUNC.checkType(Map, recipe);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.recipe, temp) === "undefined")
				this.recipe.push(temp);
			else
				FUNC.log("addRecipe Error", ENUM.LOG.error);
		}
	}
}

function Equipment(name, description, eTypeEnum, equipment, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof equipment !== "undefined") {
			this.id = FUNC.getId(ENUM.ID.item);
			this.name = name;
			this.description = description;
			this.eType = eTypeEnum;
			this.value = -1;
			this.handleLevel = 1;
			this.limitLv = 1;
			this.maxReinforce = 0;
			this.nowReinforce = 0;
			this.lvDown = 0;
			this.isWeapon = true;
			this.recipe = new Array();
			this.stat = new Map();
			this.limitStat = new Map();
			this.type = new Map();
			this.reinforce = new Map();

			FUNC.log("Created New Equipment(id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Equipment, chat) === null) {
				FUNC.log("Equipment Copy Error", ENUM.LOG.error);
				return null;
			}

			//장비의 경우, 원형을 복사하더라도 신규 아이템 취급
			this.id = FUNC.getId(ENUM.ID.item);
			this.name = equipment.iname;
			this.description = equipment.description;
			this.eType = equipment.eType;
			this.value = -equipment.value;
			this.handleLevel = equipment.handleLevel;
			this.limitLv = equipment.limitLv;
			this.maxReinforce = equipment.maxReinforce;
			this.nowReinforce = equipment.nowReinforce;
			this.lvDown = equipment.lvDown;
			this.isWeapon = true;
			this.recipe = equipment.recipe;
			this.stat = equipment.stat;
			this.limitStat = equipment.limitStat;
			this.type = equipment.type;
			this.reinforce = equipment.reinforce;

			FUNC.log("Copied Equipment(id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.items.set(this.id, this);
	}

	//[★★☆] "테스트 대검" (+3)"
	this.getFullName = function () {
		var str = "[";

		for (var i = 0; i < this.handleLevel / 2; i++)
			str += c;
		str += this.handleLevel % 2 === 0 ? "" : "☆";

		str += "] \"" + this.name + "\" (+" + this.nowReinforce + ")";
		return str;
	}

	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.stat.get(temp);
	}
	this.getLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.limitStat.get(temp);
	}
	this.getType = function (typeEnum) {
		var temp = FUNC.checkNaN(typeEnum);
		return this.type.get(temp);
	}
	this.getReinforce = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.reinforce.get(temp);
	}

	this.setname = function (name) {
		var temp = FUNC.checkType(String, name);
		if (tmpe !== null) this.name = temp;
	}
	this.setDescription = function (description) {
		var temp = FUNC.checkType(String, description);
		if (temp !== null) this.description = temp;
	}
	this.setEType = function (eTypeEnum) {
		var temp = FUNC.checkNaN(eTypeEnum);
		if (temp !== null) this.eType = temp;
	}
	this.setHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel, 1, 10);
		if (temp !== null) this.handleLevel = temp;
	}
	this.setValue = function (value) {
		var temp = FUNC.checkNaN(value);
		if (temp !== null) this.value = temp;
	}
	this.setLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv);
		if (temp !== null) this.limitLv = temp;
	}
	this.setMaxReinforce = function (maxReinforce) {
		var temp = FUNC.checkNaN(maxReinforce, 0);
		if (temp !== null) this.maxReinforce = temp;
	}
	this.setNowReinforce = function (nowReinforce) {
		var temp = FUNC.checkNaN(nowReinforce, 0, this.maxReinforce);
		if (temp !== null) this.nowReinforce = temp;
	}
	this.setLvDown = function (lvDown) {
		var temp = FUNC.checkNaN(lvDown);
		if (temp !== null) this.lvDown = temp;
	}
	this.setStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.stat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.stat.set(temp1, temp2);
		}
	}
	this.setLimitStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getLimitStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.limitStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setLimitStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.limitStat.set(temp1, temp2);
		}
	}
	this.setType = function (typeEnum, type) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type, 0, 5);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getType(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.type.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setType Error", ENUM.LOG.error);
					return;
				}
			}

			this.type.set(temp1, temp2);
		}
	}
	this.setReinforce = function (stat2Enum, stat) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getReinforce(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.reinforce.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setReinforce Error", ENUM.LOG.error);
					return;
				}
			}
			this.reinforce.set(temp1, temp2);
		}
	}

	this.addHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel);
		if (temp !== null) this.setHandleLevel(this.handleLevel + temp);
	}
	this.addValue = function (value) {
		var temp = FUNC.checkNaN(value);
		if (temp !== null) this.setValue(this.value + temp);
	}
	this.addLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv);
		if (temp !== null) this.setLimitLv(this.limitLv + temp);
	}
	this.addMaxReinforce = function (maxReinforce) {
		var temp = FUNC.checkNaN(maxReinforce);
		if (temp !== null) this.setMaxReinforce(this.maxReinforce + temp);
	}
	this.addNowReinforce = function (nowReinforce) {
		var temp = FUNC.checkNaN(nowReinforce);
		if (temp !== null) this.setNowReinforce(this.nowReinforce + temp);
	}
	this.addLvDown = function (lvDown) {
		var temp = FUNC.checkNaN(lvDown);
		if (temp !== null) this.setLvDown(this.lvDown + temp);
	}
	this.addRecipe = function (recipe) {
		var temp = FUNC.checkType(Map, recipe);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.recipe, temp) === "undefined")
				this.recipe.push(temp);
			else
				FUNC.log("addRecipe Error", ENUM.LOG.error);
		}
	}
	this.addStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined")
				this.setStat(temp1, temp2, true);
			else
				this.setStat(temp1, value + temp2, true);
		}
	}
	this.addLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitStat(temp1);

			if (typeof value === "undefined")
				this.setLimitStat(temp1, temp2, true);
			else
				this.setLimitStat(temp1, value + temp2, true);
		}
	}
	this.addType = function (typeEnum, type) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getType(temp1);

			if (typeof value === "undefined")
				this.setType(temp1, temp2, true);
			else
				this.setType(temp1, value + temp2, true);
		}
	}
	this.addReinforce = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getReinforce(temp1);

			if (typeof value === "undefined")
				this.setReinforce(temp1, temp2, true);
			else
				this.setReinforce(temp1, value + temp2, true);
		}
	}
}

function Achieve(name, achieve, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof achieve !== "undefined") {
			this.id = FUNC.getId(ENUM.ID.achieve);
			this.name = name;
			this.limitLv = 999;
			this.rewardMoney = 0;
			this.rewardExp = 0;
			this.rewardAdv = 0;
			this.limitStat = new Map();
			this.limitCloseRate = new Map();
			this.otherLimit = new Map();
			this.rewardCloseRate = new Map();
			this.rewardItem = new Map();

			FUNC.log("Created New Achieve(id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Achieve, achieve) === null) {
				FUNC.log("Achieve Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = achieve.id;
			this.name = achieve.name;
			this.limitLv = achieve.limitLv;
			this.rewardMoney = achieve.rewardMoney;
			this.rewardExp = achieve.rewardExp;
			this.rewardAdv = achieve.rewardAdv;
			this.limitStat = achieve.limitStat;
			this.limitCloseRate = achieve.limitCloseRate;
			this.otherLimit = achieve.otherLimit;
			this.rewardCloseRate = achieve.rewardCloseRate;
			this.rewardItem = achieve.rewardItem;

			FUNC.log("Copied Achieve(id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.achieves.set(this.id, this);
	}

	this.getLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.limitStat.get(temp);
	}
	this.getLimitCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.limitCloseRate.get(temp);
	}
	this.getOtherLimit = function (logName) {
		var temp = FUNC.checkNaN(logName);
		return this.otherLimit.get(temp);
	}
	this.getRewardCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.rewardCloseRate.get(temp);
	}
	this.getRewardItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.rewardItem.get(temp);
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 999);
		if (temp !== null) this.limitLv = temp;
	}
	this.setRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money, 0);
		if (temp !== null) this.money = temp;
	}
	this.setRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp, 0);
		if (temp !== null) this.rewardExp = exp;
	}
	this.setRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.rewardAdv = temp;
	}
	this.setLimitStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getLimitStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.limitStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setLimitStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.limitStat.set(temp1, temp2);
		}
	}
	this.setLimitCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getLimitCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.limitStat.delete(temp1);
					return
				}

				if (!ignore) {
					FUNC.log("setLimitCloseRate Error", ENUM.LOG.error);
					return;
				}
			}

			this.limitCloseRate.set(temp1, temp2);
		}
	}
	this.setOtherLimit = function (logName, logData, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(logName);
		var temp2 = FUNC.checkNaN(logData, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getOtherLimit(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.otherLimit.delete(temp1);
					return
				}

				if (!ignore) {
					FUNC.log("setOtherStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.otherLimit.set(temp1, temp2);
		}
	}
	this.setRewardCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(closeRate, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardCloseRate.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardCloseRate Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardCloseRate.set(temp1, temp2);
		}
	}
	this.setRewardItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardItem.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardItem Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardItem.set(temp1, temp2);
		}
	}

	this.addLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv);
		if (temp !== null) this.setLimitLv(this.limitLv + temp);
	}
	this.addRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setRewardMoney(this.rewardMoney + temp);
	}
	this.addRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.setRewardAdv(this.rewardAdv + temp);
	}
	this.addLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitStat(temp1);

			if (typeof value === "undefined")
				this.setLimitStat(temp1, temp2, true);
			else
				this.setLimitStat(temp1, value + temp2, true);
		}
	}
	this.addLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitCloseRate(temp1);

			if (typeof value === "undefined")
				this.setLimitCloseRate(temp1, temp2, true);
			else
				this.setLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addOtherLimit = function (logName, logData) {
		var temp1 = FUNC.checkNaN(logName);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getOtherLimit(temp1);

			if (typeof value === "undefined")
				this.setOtherLimit(temp1, temp2, true);
			else
				this.setOtherLimit(temp1, value + temp2, true);
		}
	}
	this.addRewardCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardCloseRate(temp1);

			if (typeof value === "undefined")
				this.setRewardCloseRate(temp1, temp2, true);
			else
				this.setRewardCloseRate(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);

			if (typeof value === "undefined")
				this.setRewardItem(temp1, temp2, true);
			else
				this.setRewardItem(temp1, value + temp2, true);
		}
	}
}

function Research(name, research, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof research === "undefined") {
			this.id = FUNC.getId(ENUM.ID.research);
			this.name = name;
			this.needMoney = 0;
			this.limitLv = 999;
			this.rewardExp = 0;
			this.needItem = new Map();
			this.limitStat = new Map();

			FUNC.log("Created New Research(id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Achieve, achieve) === null) {
				FUNC.log("Research Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = research.id;
			this.name = research.name;
			this.needMoney = research.needMoney;
			this.limitLv = research.limitLv;
			this.rewardExp = research.rewardExp;
			this.needItem = research.needItem
			this.limitStat = research.limitStat;

			FUNC.log("Copied Research(id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.researches.set(this.id, this);
	}

	this.getNeedItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.needItem.get(temp);
	}
	this.getRewardStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.rewardStat.get(temp);
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money, 0);
		if (temp !== null) this.money = temp;
	}
	this.setLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 999);
		if (temp !== null) this.limitLv = temp;
	}
	this.setRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp, 0);
		if (temp !== null) this.rewardExp = exp;
	}
	this.setNeedItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1);
		var temp2 = FUNC.checkNaN(itemCount, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.needItem.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setNeedItem Error", ENUM.LOG.error);
					return;
				}
			}

			this.needItem.set(temp1, temp2);
		}
	}
	this.setRewardStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRewardStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.rewardStat.set(temp1, temp2);
		}
	}

	this.addNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setNeedMoney(this.needMoney + temp);
	}
	this.addLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv);
		if (temp !== null) this.setLimitLv(this.limitLv + temp);
	}
	this.addRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addNeedItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);

			if (typeof value === "undefined")
				this.setNeedItem(temp1, temp2, true);
			else
				this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addRewardStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);

			if (typeof value === "undefined")
				this.setRewardStat(temp1, temp2, true);
			else
				this.setRewardStat(temp1, value + temp2, true);
		}
	}
}

function Player(nickName, name, ImageDB, room, player, isNew) {
	isNew = typeof isNew === "undefined" ? true : false;

	if (isNew) {
		if (typeof player !== "undefined") {
			this.id = FUNC.getId(ENUM.ID.player);
			this.nickName = nickName;
			this.name = name;
			this.image = FUNC.formatImage(ImageDB);
			this.lastTime = FUNC.time();
			this.recentRoom = room;
			this.coord = new Coordinate();
			this.nowTitle = "";
			this.money = 1000;
			this.lv = 1;
			this.exp = 0;
			this.totalExp = 0;
			this.sp = 10;
			this.adv = 0;
			this.ddosCheck = 0;
			this.doing = ENUM.DOING.none;
			this.nowChat = 0;
			this.achieve = new Array();
			this.research = new Array();
			this.title = new Array();
			this.nowQuest = new Array();
			this.job = new Map();
			this.mainStat = new Map();
			this.resistStat = new Map();
			this.inventory = new Map();
			this.equipped = new Map();
			this.clearedQuest = new Map();
			this.closeRate = new Map();
			this.log = new Map();
			this.type = new Map();
			this.buff = new Map();

			//TODO : 스텟 관련 초기화

			this.setLog(ENUM.LOGDATA.createdTime, FUNC.time());

			FUNC.log("Created New Player(id : " + this.id + ", name : " + this.name + ")");
		}

		else {
			if (FUNC.checkType(Player, player) === null) {
				FUNC.log("Player Copy Error", ENUM.LOG.error);
				return null;
			}

			this.id = player.id;
			this.nickName = player.nickName;
			this.name = player.name;
			this.image = player.image;
			this.lastTime = FUNC.time();
			this.recentRoom = player.room;
			this.coord = player.coord;
			this.nowTitle = player.ntle;
			this.money = player.money;
			this.lv = player.lv;
			this.exp = player.exp;
			this.totalExp = player.totalExp;
			this.sp = player.sp;
			this.adv = player.adv;
			this.ddosCheck = player.ddosCheck;
			this.doing = player.doing;
			this.nowChat = player.nowChat;
			this.achieve = player.achieve;
			this.research = player.research;
			this.title = player.title;
			this.nowQuest = player.nowQuest;
			this.job = player.job;
			this.mainStat = player.mainStat;
			this.resistStat = player.resistStat;
			this.inventory = player.inventory;
			this.equipped = player.equipped;
			this.clearedQuest = player.clearedQuest;
			this.closeRate = player.closeRate;
			this.log = player.log;
			this.type = player.type;
			this.buff = player.buff;

			FUNC.log("Copied Player(id : " + this.id + ", name : " + this.name + ")");
		}

		VAR.players.set(this.id, this);
	}

	//[테스트 칭호] 남식
	this.getFullName = function () {
		return "[" + this.nowTitle + "] " + this.nickName;
	}

	this.sendText = function (chatId, npcName) {
		this.setDoing(ENUM.DOING.chat);

		var temp1 = FUNC.checkNaN(chatId, 1, VAR.chats.size);
		var temp2 = FUNC.checkType(String, npcName);

		if (temp1 === null || temp2 === null) {
			FUNC.log("sendText Error", ENUM.LOG.error);
			return;
		}

		var chat = VAR.id.get(temp1);
		var length = chat.text.length;
		for (var i = 0; i < length - 1; i++) {
			FUNC.reply(this.id, temp2 + " : \"" + chat.text[i] + "\"");
			FUNC.sleep(chat.pause);
		}

		var text = temp2 + " : \"" + chat.text[length - 1] + "\"\n\n";
		var more = "";
		if (chat.wait.length !== 1 || chat.wait[0] !== ENUM.WAIT_RESPONSE.nothing) {
			text += "입력을 해야 대화가 종료됩니다";
			this.setNowChat(chat.id);
		}

		else
			text += "대화가 종료되었습니다";

		for (var [itemId, itemCount] of chat.item) {
			if (this.getInventory(itemId) < (-1 * itemCount)) {
				FUNC.reply(this.id, "보유 아이템이 부족하여 대화가 중지됩니다");
				return;
			}
		}

		for (var [stat2Enum, stat] of chat.stat) {
			if (this.getMainStat(ENUM.STAT1.totalStat, stat2Enum) < (-1 * stat)) {
				FUNC.reply(this.id, "스텟이 부족하여 대화가 중지됩니다");
				return;
			}
		}

		if (chat.money * -1 > this.money) {
			FUNC.reply(this.id, "보유 금액이 부족하여 대화가 중지됩니다");
			return;
		}

		if (chat.quest !== 0) {
			if (!this.canAddQuest(chat.quest)) {
				FUNC.reply(this.id, "퀘스트 추가가 불가능하여 대화가 중지됩니다");
				return;
			}

			this.addNowQuest(chat.quest);
			more += "퀘스트 추가 완료\n";
		}

		if (chat.money !== 0) {
			this.addMoney(chat.money);
			more += "돈 추가 완료\n";
		}

		if (teleport !== null) {
			this.setCoord(chat.teleport.x, chat.teleport.y);
			more += "순간이동 완료\n";
		}

		if (chat.stat.size > 0) {
			for (var [stat2Enum, stat] of chat.stat)
				this.addMainStat(ENUM.STAT1.actStat, stat2Enum, stat);

			more += "스텟 설정 완료\n";
		}

		if (chat.item.size > 0) {
			for (var [itemId, itemCount] of chat.item)
				this.addInventory(itemId, itemCount);

			more += "아이템 설정 완료";
		}

		FUNC.reply(this.id, text, more);
	}

	this.executeChat = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);

		if (temp === null) {
			FUNC.log("executeChat Error", ENUM.LOG.error);
			return;
		}

		var npc = VAR.npcs.get(temp);
		var availableChat = npc.getAvailableChat(this.getId());
		var totalPercent = 0;
		var chatId = -1;

		for (var chat of availableChat) {
			value = chat.get("percent");

			if (value !== -1)
				totalPercent += value;

			else {
				chatId = chat.get("chat");
				break;
			}
		}

		if (chatId === -1) {
			var random = FUNC.random(1, totalPercent);

			var value = 0;
			for (var chat of availableChat) {
				value += chat.get("percent");

				if (value >= random) {
					chatId = chat.get("chat");
					break;
				}
			}
		}

		var chat = VAR.chats.get(chatId);
		this.sendText(chat.id, npc.name);
		this.addLog(ENUM.LOGDATA.npcChat, 1);
	}

	this.getRequireExp = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 998);

		if (temp !== null) {
			if (temp <= 100)
				return 100 + (temp * 2);
			else if (temp <= 200)
				return 250 + (x * 4);
			else if (temp <= 400)
				return 1000 + (x * 10);
			else if (temp <= 650)
				return 8000 + Math.floor(Math.pow(x - 400, 17 / 9));
			else if (temp <= 700)
				return 25000 + (x * 30);
			else if (temp <= 800)
				return -290000 + (x * 500);
			else if (temp <= 850)
				return 120000 + Math.floor(Math.pow(x - 800, 10 / 3));
			else if (temp <= 950)
				return -16000000 + (20000 * x);
			else if (temp <= 990)
				return 2500000 + (1000 * x);
			else
				return -95000000 + (1000 * x);
		}
	}

	this.tuneExp = function (changeExp) {
		var temp = FUNC.checkNaN(changeExp);

		if (temp !== null) {
			var notice = temp > 0 ? true : false;
			var noticeLv = 0;
			var lvChanged = false;

			if (temp < 0) {
				this.lv = 0;
				this.exp = 0;
				temp = this.totalExp + temp + this.exp;
			}

			var func = function () {
				var needExp = this.getRequireExp(this.lv) - this.exp;

				if (temp >= needExp) {
					this.lv += 1;
					this.exp = 0;
					temp -= needExp;

					if (notice) {
						if (this.lv % 100 === 0)
							noticeLv = this.lv;
						this.addSp(VAR.spGive);
					}

					lvChanged = true;

					return true;
				}

				if (lvChanged) {
					var str = this.getFullName() + "님이 " + this.lv + " 레벨을 달성하였습니다";
					FUNC.system(this.recentRoom, str);

					if (notice && noticeLv !== 0)
						FUNC.systemAll(str);
				}

				this.exp = temp;
				return false;
			}

			for (var i = 0; i < 1000; i++) {
				if (!func())
					break;
			}
		}
	}

	this.canAddQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);

		if (temp === null)
			return false;

		var quest = VAR.quests.get(temp);
		if (quest.minLimitLv > this.lv || quest.maxLimitLv < this.lv ||
			FUNC.check(quest.maxLimitCloseRate, this.closeRate, ENUM.CHECKING.big, false, true) ||
			FUNC.check(quest.minLimitCloseRate, this.closeRate, ENUM.CHECKING.small, false, true) ||
			FUNC.check(quest.maxLimitStat, this.mainStat.get(ENUM.STAT1.totalStat), ENUM.CHECKING.big, false, true) ||
			FUNC.check(quest.minLimitStat, this.mainStat.get(ENUM.STAT1.totalStat), ENUM.CHECKING.small, false, true))
			return false;

		if (typeof FUNC.findValue(this.nowQuest, temp) !== "undefined")
			return false;
		if (!quest.isRepeatable && typeof this.getClearedQuest(temp) !== "undefined")
			return false;

		return true;
	}

	this.canAddAchieve = function (achieveId) {
		var temp = FUNC.checkNaN(achieveId, 1, VAR.achieves.size);

		if (temp === null)
			return false;

		var achieve = VAR.achieves.get(temp);

		if (achieve.limitLv <= this.lv &&
			FUNC.check(achieve.limitStat, this.mainStat.get(ENUM.STAT1.mainStat), ENUM.CHECKING.big, false, true) &&
			FUNC.check(achieve.limitCloseRate, this.closeRate, ENUM.CHECKING.big, false, true) &&
			FUNC.check(achieve.otherLimit, this.log, ENUM.CHECKING.big, false, true))
			return true;
		return false;
	}

	this.canAddResearch = function (researchId) {
		var temp = FUNC.checkNaN(researchId, 1, VAR.researches.size);

		if (temp === null)
			return false;

		var research = VAR.researches.get(temp);

		if (research.needMoney <= this.money && research.limitLv <= this.lv &&
			FUNC.check(research.needItem, this.inventory, ENUM.CHECKING.big, false, true))
			return true;
		return false;
	}

	this.canAddTitle = function (title) {
		var temp = FUNC.checkType(String, title);

		if (temp === null)
			return false;

		if (typeof FUNC.findValue(this.title, temp) === "undefined")
			return true;
		return false;
	}

	this.canClearQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);

		if (temp === null)
			return false;

		var quest = FUNC.findValue(this.nowQuest, temp);
		if (typeof quest === "undefined" && quest.needMoney <= this.money &&
			quest.needExp <= this.totalExp && quest.needAdv <= this.adv &&
			FUNC.check(quest.needItem, this.inventory, ENUM.CHECKING.big, false, true) &&
			FUNC.check(quest.needStat, this.mainStat.get(ENUM.STAT1.totalStat), false, true))
			return true;
		return false;
	}

	this.clearQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);

		if (temp !== null) {
			var quest = VAR.quests.get(temp);

			this.addMoney((-1 * quest.needMoney) + quest.rewardMoney);
			this.addExp((-1 * quest.needExp) + quest.rewardExp);
			this.addAdv((-1 * quest.needAdv) + quest.rewardAdv);

			for (var [itemId, itemCount] of quest.needItem)
				this.addInventory(itemId, -1 * itemCount);
			for (var [stat2Enum, stat] of quest.needStat)
				this.addMainStat(ENUM.STAT1.actStat, stat2Enum, -1 * stat);

			for (var [itemId, itemCount] of quest.rewardItem)
				this.addInventory(itemId, itemCount);
			for (var [stat2Enum, stat] of quest.rewardStat)
				this.addMainStat(ENUM.STAT1.actStat, stat2Enum, stat);
			for (var [npcId, closeRate] of quest.rewardCloseRate)
				this.addCloseRate(npcId, closeRate);

			FUNC.removeValue(this.nowQuest, temp);
			this.addLog(ENUM.LOGDATA.questCleared, 1);
		}
	}

	this.canEquip = function (equipmentId) {
		var temp = FUNC.checkNaN(equipmentId, 1, VAR.items.size);

		if (temp === null)
			return false;

		var equipment = this.getInventory(temp);
		if (typeof equipment === "undefined")
			return false;

		if (!equipment.isWeapon) {
			FUNC.log("canEquip Error", ENUM.LOG.error);
			return false;
		}

		if (equipment.limitLv <= this.lv &&
			FUNC.check(equipment.limitStat, this.mainStat.get(ENUM.STAT1.totalStat), ENUM.CHECKING.big, false, true))
			return true;
		return false;
	}

	this.equip = function (equipmentId) {
		var temp = FUNC.checkNaN(equipmentId, 1, VAR.items.size);

		if (temp !== null) {
			var equipment = this.getInventory(temp);
			var equipped = this.getEqiupped(equipment.eType);

			for (var [stat2Enum, stat] of equipment.stat)
				this.addMainStat(ENUM.STAT1.equipStat, stat2Enum, stat);
			for (var [typeEnum, type] of equipment.type)
				this.addType(typeEnum, type);

			if (typeof equipped !== "undefined") {
				for (var [stat2Enum, stat] of equipped.stat)
					this.addMainStat(ENUM.STAT1.equipStat, stat2Enum, -1 * stat);
				for (var [typeEnum, type] of equipped.type)
					this.addType(typeEnum, -1 * type);
			}

			this.setEquipped(equipment.eType, temp, true);
		}
	}

	this.handleQuest = function () {
		var quest;

		for (var questId of nowQuest) {
			if (this.canClearQuest(questId)) {
				quest = VAR.quests.get(questId);

				FUNC.reply(this.id, "\"" + quest.name + "\" 퀘스트를 클리어하였습니다!");
				this.clearQuest(questId);
			}
		}
	}

	this.handleAchieve = function () {
		for (var achieve of VAR.achieves.values()) {
			if (this.achieve.includes(achieve.id))
				continue;
			if (this.canAddAchieve(achieve.id))
				this.addAchieve(achieve.id);
		}
	}

	this.handleBuff = function () {
		var time = FUNC.time();
		var stat2;

		for (var [stat2Enum, buffMap] of this.buff) {
			stat2 = stat2Enum;

			for (var [endTime, stat] of buffMap) {
				if (endTime < time) {
					this.addMainStat(ENUM.STAT1.buffStat, stat2, -1 * stat);
					this.buff.delete(endTime);
				}
			}

			if (this.buff.get(stat2Enum).size === 0)
				this.buff.delete(stat2Enum);
		}
	}

	this.isDdos = function () {
		var time = FUNC.time();

		if (time - this.ddosCheck < VAR.ddosTime)
			return true;

		this.ddosCheck = time;
		return false;
	}

	this.updateStat = function () {
		this.handleBuff();

		var basicStat, levelStat, equipStat, buffStat, quickStat, actStat, increStat;
		for (var stat2 = 0; stat2 < ENUM.STAT2.max; stat2++) {
			basicStat = this.getMainStat(ENUM.STAT1.basicStat, stat2);
			levelStat = this.getMainStat(ENUM.STAT1.levelStat, stat2);
			equipStat = this.getMainStat(ENUM.STAT1.equipStat, stat2);
			buffStat = this.getMainStat(ENUM.STAT1.buffStat, stat2);
			quickStat = this.getMainStat(ENUM.STAT1.quickStat, stat2);
			actStat = this.getMainStat(ENUM.STAT1.actStat, stat2);

			basicStat = typeof basicStat === "undefined" ? 0 : levelStat;
			levelStat = typeof levelStat === "undefined" ? 0 : levelStat;
			equipStat = typeof equipStat === "undefined" ? 0 : equipStat;
			buffStat = typeof buffStat === "undefined" ? 0 : buffStat;
			quickStat = typeof quickStat === "undefined" ? 0 : quickStat;
			actStat = typeof actStat === "undefined" ? 0 : actStat;
			increStat = levelStat + equipStat + buffStat + quickStat + actStat;

			this.mainStat.get(ENUM.STAT1.increStat).set(stat2, increStat);
			this.mainStat.get(ENUM.STAT1.totalStat).set(stat2, basicStat + increStat);
			this.addLog(ENUM.LOGDATA.statUpdated, 1);
		}
	}

	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getMainStat = function (stat1Enum, stat2Enum) {
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);

		if (temp1 !== null && temp2 !== null && this.stat.has(temp1))
			return this.stat.get(temp1).get(temp2);
		return undefined;
	}
	this.getResistStat = function (typeEnum) {
		var temp = FUNC.checkNaN(typeEnum);
		return this.resistStat.get(temp);
	}
	this.getInventory = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.inventory.get(temp);
	}
	this.getEqiupped = function (eTypeEnum) {
		var temp = FUNC.checkNaN(eTypeEnum);
		return this.equipped.get(temp);
	}
	this.getClearedQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);
		return this.clearedQuest.get(temp);
	}
	this.getCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.closeRate.get(temp);
	}
	this.getLog = function (logName) {
		var temp = FUNC.checkNaN(logName);
		return this.log.get(temp);
	}
	this.getType = function (typeEnum) {
		var temp = FUNC.checkNaN(typeEnum);
		return this.type.get(temp);
	}
	this.getBuff = function (stat2Enum, minEndTime, maxEndTime) {
		var temp1 = FUNC.checkNaN(stat2Enum, 0);
		var temp2 = FUNC.checkNaN(minEndTime, 0);
		var temp3 = FUNC.checkNaN(maxEndTime);
		var output = 0;

		if (temp1 !== null && temp2 !== null && temp3 !== null && this.buff.has(temp1)) {
			var map = this.buff.get(temp1);
			for (var [endTime, stat] of map) {
				if (endTime >= temp1 && endTime <= temp2)
					output += stat;
			}
		}

		return output;
	}
	this.getBuffs = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		var output = 0;

		if (temp !== null) {
			for (var stat of this.buff.get(temp1).values())
				output += stat;
		}

		return output;
	}

	this.setNickName = function (nickName) {
		var temp = FUNC.checkType(String, nickName);
		if (temp !== null) this.nickName = temp;
	}
	this.setName = function (name) {
		var temp = FUNC.checkType(String, name);
		if (temp !== null) this.name = temp;
	}
	this.setImage = function (image) {
		var temp = FUNC.checkType(String, image);
		if (temp !== null) this.image = temp;
	}
	this.setLastTime = function (lastTime) {
		var temp = FUNC.checkNaN(lastTime, 0);
		if (temp !== null) this.nickName = temp;
	}
	this.setRecentRoom = function (recentRoom) {
		var temp = FUNC.checkType(String, recentRoom);
		if (temp !== null) this.recentRoom = temp;
	}
	this.setCoord = function (x, y) {
		var temp1 = FUNC.checkNaN(x, 0);
		var temp2 = FUNC.checkNaN(y, 0);

		if (temp1 !== null && temp2 !== null) {
			this.coord.setX(temp1);
			this.coord.setY(temp2);

			var x = this.coord.x
			var y = this.coord.y;
			var distance = Math.sqrt(Math.pow(x + temp1, 2) + Math.pow(y + temp2, 2));
			this.addLog(ENUM.LOGDATA.moveDistance, distance);
		}
	}
	this.setNowTitle = function (nowTitle) {
		var temp = FUNC.checkType(String, nowTitle);
		if (temp !== null) this.nowTitle = temp;
	}
	this.setMoney = function (money) {
		var temp = FUNC.checkNaN(money, 0);

		if (temp !== null) {
			this.money = temp;

			var value;

			if (temp > 0) {
				value = this.getLog(ENUM.LOGDATA.maxMoney);
				if (temp > value)
					this.setLog(ENUM.LOGDATA.maxMoney, temp);
			}

			else {
				value = this.getLog(ENUM.LOGDATA.maxPayment);
				if (temp < value)
					this.setLog(ENUM.LOGDATA.maxPayment, temp);
			}

			this.handleQuest();
		}
	}
	this.setLv = function (lv) {
		var temp = FUNC.checkNaN(lv, 1, 999);
		if (temp !== null) this.lv = temp;
	}
	this.setSp = function (sp) {
		var temp = FUNC.checkNaN(sp, 0);
		if (temp !== null) this.sp = temp;
	}
	this.setAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, 0);
		if (temp !== null) {
			this.adv = temp;
			this.handleQuest();
		}
	}
	this.setDoing = function (doingEnum) {
		var temp = FUNC.checkNaN(doingEnum, 0);
		if (temp !== null) this.doing = temp;
	}
	this.setNowChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, 1, VAR.chats.size);
		if (temp !== null) this.nowChat = temp;
	}
	this.setJob = function (jobEnum, jobLv, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getJob(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.job.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setJob Error", ENUM.LOG.error);
					return;
				}
			}

			this.job.set(temp1, temp2);
		}
	}
	this.setMainStat = function (stat1Enum, stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp1 !== ENUM.STAT1.totalStat) {
			if (typeof this.getMainStat(temp1, temp2) !== "undefined") {
				if (temp3 === 0) {
					this.mainStat.get(temp1).delete(temp2);
					return;
				}

				if (!ignore) {
					FUNC.log("setMainStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.mainStat.get(temp1).set(temp2, temp3);
			this.updateStat();
			this.handleQuest();
			this.handleAchieve();
		}
	}
	this.setResistStat = function (typeEnum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getResistStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.resistStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setResistStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.resistStat.set(temp1, temp2);
		}
	}
	this.setInventory = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getInventory(temp1);
			var changed = temp2 - (typeof value === "undefined" ? 0 : value);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.inventory.delete(temp1);
					this.addLog(ENUM.LOGDATA.usedItem, value);

					return;
				}

				if (!ignore) {
					FUNC.log("setInventory Error", ENUM.LOG.error);
					return;
				}
			}

			this.inventory.set(temp1, temp2);

			if (changed < 0)
				this.addLog(ENUM.LOGDATA.usedItem, changed);
			else
				this.addLog(ENUM.LOGDATA.gottenItem, changed);

			this.handleQuest();
		}
	}
	this.setEquipped = function (eTypeEnum, equipmentId, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(eTypeEnum);
		var temp2 = FUNC.checkNaN(equipmentId, 1, VAR.items.size);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getEqiupped(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.equipped.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setEquipped Error", ENUM.LOG.error);
					return;
				}
			}

			this.equipped.set(temp1, temp2);
		}
	}
	this.setClearedQuest = function (questId, clearCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(questId, 1, VAR.quests.size);
		var temp2 = FUNC.checkNaN(clearCount);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getClearedQuest(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.clearedQuest.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setClearedQuest Error", ENUM.LOG.error);
					return;
				}
			}

			this.clearedQuest.set(temp1, temp2);
		}
	}
	this.setCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.closeRate.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setCloseRate Error", ENUM.LOG.error);
					return;
				}
			}

			this.closeRate.set(temp1, temp2);

			var maxCloseRate = this.getLog(ENUM.LOGDATA.maxCloseRate);
			maxCloseRate = typeof maxCloseRate === "undefined" ? 0 : maxCloseRate;
			if (temp2 > maxCloseRate)
				this.setLog(ENUM.LOGDATA.maxCloseRate, temp2);
			this.addLog(ENUM.LOGDATA.totalCloseRate, temp2);

			this.handleQuest();
			this.handleAchieve();
		}
	}
	this.setLog = function (logName, logData) {
		var temp1 = FUNC.checkNaN(logName);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			this.log.set(temp1, temp2);
			this.handleAchieve();
		}
	}
	this.setType = function (typeEnum, type, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getType(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.type.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setType Error", ENUM.LOG.error);
					return;
				}
			}

			this.type.set(temp1, temp2);
		}
	}
	this.setBuff = function (stat2Enum, remainTime, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(remainTime, 0) + FUNC.time();
		var temp3 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getBuff(temp1, temp2, temp2);

			if (typeof value !== "undefined") {
				if (temp3 === 0) {
					this.addMainStat(ENUM.STAT1.buffStat, temp1, -1 * value);
					this.buff.get(temp1).delete(temp2);
					return;
				}

				if (!ignore) {
					FUNC.log("setBuff Error", ENUM.LOG.error);
					return;
				}
			}

			this.addMainStat(ENUM.STAT1.buffStat, temp1, temp3);
			this.buff.get(temp1).set(temp2, temp3);
			this.addLog(ENUM.LOGDATA.buffReceived, 1);
		}
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(money);
		if (temp !== null) this.setMoney(this.money + temp);
	}
	this.addLv = function (lv) {
		var temp = FUNC.checkNaN(lv);
		if (temp !== null) this.setLv(this.lv + temp);
	}
	this.addExp = function (exp) {
		var temp = VAR.expBoost * FUNC.checkNaN(exp);

		if (temp !== null) {
			this.tuneExp(temp);
			this.totalExp += temp;

			this.handleQuest();
			this.handleAchieve();
		}
	}
	this.addSp = function (sp) {
		var temp = FUNC.checkNaN(sp);
		if (temp !== null) this.setSp(this.sp + temp);
	}
	this.addAdv = function (adv) {
		var temp = FUNC.checkNaN(adv);
		if (temp !== null) this.setAdv(this.adv + temp);
	}
	this.addAchieve = function (achieveId) {
		var temp = FUNC.checkNaN(achieveId, 1, VAR.achieves.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.achieve, temp) === "undefined") {
				var achieve = VAR.achieves.get(temp);

				this.addMoney(achieve.rewardMoney);
				this.addExp(achieve.rewardExp);
				this.addAdv(achieve.rewardAdv);

				for (var [npcId, closeRate] of achieve.rewardCloseRate)
					this.addCloseRate(npcId, closeRate);
				for (var [itemId, itemCount] of achieve.rewardItem)
					this.addInventory(itemId, itemCount);

				this.achieve.push(temp);

				FUNC.reply(this.id, "\"" + value.name + "\" 업적을 달성하였습니다!");
			}

			else
				FUNC.log("addAchieve Error", ENUM.LOG.error);
		}
	}
	this.addResearch = function (researchId) {
		var temp = FUNC.checkNaN(researchId, 1, VAR.researches.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.achieve, temp) === "undefined") {
				var research = VAR.researches.get(temp);

				this.addMoney(-1 * research.needMoney);
				this.addExp(research.rewardExp);

				for (var [itemId, itemCount] of research.needItem)
					this.addInventory(itemId, -1 * itemCount);

				for (var [stat2Enum, stat] of research.rewardStat)
					this.addMainStat(ENUM.STAT1.actStat, stat2Enum, stat);

				this.research.push(temp);

				FUNC.reply(this.id, "\"" + value.name + "\" 연구를 마쳤습니다!");
			}

			else
				FUNC.log("addResearch Error", ENUM.LOG.error);
		}
	}
	this.addTitle = function (title) {
		var temp = FUNC.checkType(String, title);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.achieve, temp) === "undefined")
				this.title.push(temp);
			else
				FUNC.log("addTitle Error", ENUM.LOG.error);
		}
	}
	this.addNowQuest = function (questId) {
		var temp = FUNC.checkNaN(questId);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.nwoQuest, temp) === "undefined") {
				this.nowQuest.push(temp);
				this.addLog(ENUM.LOGDATA.questReceived, 1);
			}

			else
				FUNC.log("addNowQuest Error", ENUM.LOG.error);
		}
	}
	this.addJob = function (jobEnum, jobLv) {
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getJob(temp1);

			if (typeof value === "undefined")
				this.setJob(temp1, temp2);
			else
				this.setJob(temp1, value + temp2, true);
		}
	}
	this.addMainStat = function (stat1Enum, stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getMainStat(temp1, temp2);

			if (typeof value === "undefined")
				this.setMainStat(temp1, temp2);
			else
				this.setMainStat(temp1, value + temp2, true);
		}
	}
	this.addResistStat = function (typeEnum, type) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getResistStat(temp1);

			if (typeof value === "undefined")
				this.setResistStat(temp1, temp2);
			else
				this.setResistStat(temp1, value + temp2, true);
		}
	}
	this.addInventory = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getInventory(temp1);

			if (typeof value === "undefined")
				this.setInventory(temp1, temp2);
			else
				this.setInventory(temp1, value + temp2, true);
		}
	}
	this.addClearedQuest = function (questId, clearCount) {
		var temp1 = FUNC.checkNaN(questId, 1, VAR.quests.size);
		var temp2 = FUNC.checkNaN(clearCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getClearedQuest(temp1);

			if (typeof value === "undefined")
				this.setClearedQuest(temp1, temp2);
			else
				this.setClearedQuest(temp1, value + temp2, true);
		}
	}
	this.addCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getCloseRate(temp1);

			if (typeof value === "undefined")
				this.setCloseRate(temp1, temp2);
			else
				this.setCloseRate(temp1, value + temp2, true);
		}
	}
	this.addLog = function (logName, logData) {
		var temp1 = FUNC.checkNaN(logName);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLog(temp1);

			if (typeof value === "undefined")
				this.setLog(temp1, temp2);
			else
				this.setLog(temp1, value + temp2);
		}
	}
	this.addType = function (typeEnum, type) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getType(temp1);

			if (typeof value === "undefined")
				this.setType(temp1, temp2);
			else
				this.setType(temp1, value + temp2, true);
		}
	}
	this.addBuff = function (stat1Enum, stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getMainStat(temp1, temp2);
			if (typeof value === "undefined")
				this.setBuff(temp1, temp2);
			else
				this.setBuff(temp1, value + temp2, true);
		}
	}
}

var evalNumber = 0;
var evalError = 0;
var evalTime;
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
	try {
		if (typeof FUNC.findValue(VAR.rooms, room) === "undefined")
			this.rooms.push(room);

		if (msg.startsWith("..")) {
			var player = FUNC.findPlayer(sender, ImageDB);

			if (typeof player === "undefined")
				nonPlayerFunc(msg);

			else {
				if (player.isDdos()) {
					replier.reply("채팅의 간격은 최소 " + VAR.ddosTime + "ms 이어야 합니다");
					return;
				}

				player.addLog(ENUM.LOGDATA.chat, 1);
				if (msg === "이모티콘을 보냈습니다.")
					player.addLog(ENUM.LOGDATA.emoteSent, 1);

				if (playerFunc(msg)) {
					var time = new Date();
					var lastTime = new Date(player.lastTime);

					if (time.getDate() !== lastTime.getDate())
						player.addLog(ENUM.LOGDATA.playedDay, 1);

					player.setLastTime(time);
					player.setRecentRoom(room);
				}

				VAR.msgCount++;
				if (msgCount >= 100) {
					Api.makeNoti("Data Saved", String(this.time()), 3);
					FUNC.saveDB();
				}
			}
		}

		else {
			if (msg.startsWith("neval ")) {
				var split = msg.split(" ");

				if (split[1] === "start") {
					evalNumber = FUNC.random(100000, 999999);
					evalTime = FUNC.time();

					Api.makeNoti("Eval Number", String(evalNumber), 1);
				}

				else if (split[1] === "end")
					evalNumber = 0;

				else if (split[1] === "eval") {
					if (evalNumber === 0)
						replier.reply("Eval Number를 생성해주십시오");

					else if (evalTime > FUNC.time() + 300000) {
						replier.reply("Eval Number는 이미 만료되었습니다");
						evalNumber = 0;
					}

					else {
						if (split[2] === String(evalNumber)) {
							evalTime = FUNC.time();
							eval(msg.substr(18));
						}

						else {
							evalError++;

							if (evalError >= 5) {
								evalNumber = 0;
								evalError = 0;
								replier.reply("Eval Number를 5회 이상 틀려 만료시킵니다");
							}

							else
								replier.reply("Eval Number를 틀리셨습니다 - [틀린 횟수 : " + evalError + "]");
						}
					}
				}
			}
		}
	} catch (e) {
		FUNC.log("<RUNTIME> - " + e, ENUM.LOG.error);
	}
}

function nonPlayerFunc(msg) {

}

function playerFunc(msg) {
	return false;
}


function onStartCompile() {
	FUNC.loadDB();
}
const scriptName = "cnkb.js";

const kalingModule = require("./kaling").Kakao();
const Kakao = new kalingModule;
Kakao.init('0cbf070cc46c70fe11cfe7b90cd93874');
Kakao.login("nambap6460@gmail.com", "64qlalfqjsgh60!");

const FUNC = {
	loadDB: function () {

	},

	saveDB: function () {

	},

	setDB: function (path) {

	},

	setDB: function (path, data) {

	},

	saveLog: function () {

	},

	line: function () {
		var e = new Error();
		if (!e.stack) try {
			throw e;
		} catch (e) {
			if (!e.stack) {
				return "0"; // IE < 10, likely
			}
		}
		var stack = e.stack.toString().split(/\r\n|\n/);
		var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
		do {
			var frame = stack.shift();
		} while (!frameRE.exec(frame) && stack.length);
		return frameRE.exec(stack.shift())[1];
	},

	log: function (logState, line, logType) {
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
		VAR.log += " (" + line + ") - " + logState + "\n";
	},

	checkType: function (original, variable, line) {
		if (typeof variable !== typeof original) {
			this.log("Type Error - (original : " + typeof original + ", variable : " + typeof variable + ")", line, ENUM.LOG.error);
			return original;
		}

		return variable;
	},

	checkType_: function (func, variable, line) {
		var funcName = this.getFuncName(func);
		var varFuncName = variable.constructor.name;

		if (funcName !== varFuncName) {
			this.log("Type Error - (func : " + funcName + ", variable : " + varFuncName + ")", line, ENUM.LOG.error);
			return null;
		}

		return variable;
	},

	checkNaN: function (defaultReturn, variable, line, min, max) {
		if (isNaN(variable) || (typeof min !== "undefined" && variable < min) || (typeof max !== "undefined" && variable > max)) {
			this.log("NaN Error - (default : " + defaultReturn + ", variable : " + variable + ")", line, ENUM.LOG.error);
			return defaultReturn;
		}

		return Number(variable);
	},

	getId: function (idType) {
		var value = Number(VAR.id.get(idType));

		if (typeof value !== "undefined") {
			VAR.id.set(idType, value + 1)
			return value;
		}

		else {
			VAR.id.set(idType, 2);
			return 1;
		}
	},

	random: function (max) {
		return Math.random() * max + 1;
	},

	getFuncName: function (func) {
		return String(func).substring(9, 10);
	},

	checkStat2: function (original, comparing, checking, ignore) {
		ignore = typeof ignore !== "undefined" ? ignore : true;
		checking = typeof checking !== "undefined" ? checking : ENUM.CHECKING.same;

		var iterator = original.entries();
		var value, compare;
		while (true) {
			value = iterator.next().value;

			if (typeof value === "undefined")
				return true;

			if (!comparing.has(value[0])) {
				if (!ignore)
					return false;
				continue;
			}

			if (value[1] === comparing.get(value[0]))
				compare = ENUM.CHECKING.same;
			else if (value[1] > comparing.get(value[1]))
				compare = ENUM.CHECKING.small;
			else
				compare = ENUM.CHECKING.big;

			if (compare !== checking)
				return false;
		}
	},

	reply: function (player, text, more) {
		Api.replyRoom(player.getRecentRoom(),
			"[" + player.getTitle() + "] " + player.getNickName() + "\n" +
			text + VAR.all + "----------" + more, true);
	},

	time: function () {
		return Date.now();
	}
};

const ENUM = {
	"LOG": {
		"info": 0,
		"warning": 1,
		"error": 2
	},
	"CHECKING": {
		"small": -1,
		"same": 0,
		"big": 1
	},
	"STAT1": {
		"basicStat": 0,			//전직 떄에만 가변, 기본 불변
		"levelStat": 1,			//SP로 증가 가능, 감소 불가능
		"equipStat": 2,			//장비 변경 시 증감
		"quickStat": 3,			//일시적으로 저장되는 스텟
		"ARStat": 4,			//연구/업적 스텟
		"increStat": 5,			//레벨 스텟 + 이큅 스텟 + 퀵 스텟 + AR 스텟
		"totalStat": 6,			//베이직 스텟 + 인크리 스텟
		"max": 6
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
		"MERCHANT": 0,			//일반 상인
		"MAGIC_MERCHANT": 1,	//마법 상인
		"DARK_DEALER": 2,		//암흑 거래상
		"WANDERING_TRADER": 3,	//떠돌이 상인
		"BLACKSMITH": 4,		//대장장이
		"MAGIC_BLACKSMITH": 5,	//마법 대장장이
		"FARMER": 6,			//농부
		"COACHMAN": 7,			//마부
		"WARRIOR": 8,			//전사
		"MAGICIAN": 9,			//마법사
		"TANKER": 10,			//탱커
		"ARCHER": 11,			//궁수
		"PRIEST": 12,			//성직자
		"DARK_PRIEST": 13,		//암흑 성직자
	},
	"WAIT_RESPONSE": {
		"NOTHING": 0,			//대답 없음
		"YES": 1,				//"예" 또는 "Y" 또는 "y" 또는 "ㅇ" 또는 "dd"
		"NO": 2,				//"아니오" 또는 "아니요" 또는 "N" 또는 "n" 또는 "ㄴ" 또는 "ss"
		"NUMBER": 3,			//숫자 형태 전부
		"ANYTHING": 4,			//아무 채팅
	},
	"DOING": {
		"NONE": 0,				//IDLE 상태
		"MOVE": 1,				//이동
		"BUY": 2,				//구매
		"CHAT": 3,				//NPC와 대화
		"FIGHT": 4,				//전투
		"EXPLORE": 5,			//탐험/수색
		"MINE": 6,				//광질 및 다양한 채집
		"REINFORCE": 7,			//강화, 마법부여 등
	},
	"ID": {
		"PLAYER": 0,
		"CHAT": 1,
		"NPC": 2,
		"QUEST": 3,
		"ITEM": 4,
		"EQUIPMENT": 5,
		"ACHIEVE": 6,
		"RESEARCH": 7
	}
};

const VAR = {
	"log": "",
	"players": new Map(),
	"chats": new Map(),
	"npcs": new Map(),
	"quests": new Map(),
	"items": new Map(),
	"equipments": new Map(),
	"achieves": new Map(),
	"researches": new Map(),
	"id": new Map(),
	"all": "\n\n" + ("\u200b".repeat(500))
};

function Coordinate(x, y) {
	x = typeof x !== "undefined" ? x : 0;
	y = typeof y !== "undefined" ? y : 0;

	this.x = x;
	this.y = y;

	this.getX = function () {
		return this.x;
	}
	this.getY = function () {
		return this.y;
	}

	this.setX = function (x) {
		this.x = FUNC.checkNaN(this.getX(), x, FUNC.line(), 0);
	}
	this.setY = function (y) {
		this.y = FUNC.checkNaN(this.getY(), y, FUNC.line(), 0);
	}

	this.addX = function (x) {
		var temp = FUNC.checkNaN(null, x, FUNC.line(), 0);
		if (temp !== null) this.setX(this.getX() + temp);
	}
	this.addY = function (y) {
		var temp = FUNC.checkNaN(null, y, FUNC.line(), 0);
		if (temp !== null) this.setY(this.getY() + temp);
	}
}

function Chat(name, text, chat) {
	this.id = FUNC.getId(ENUM.ID.CHAT);
	this.name = name;
	this.text = text;
	this.money = 0;
	this.teleport = new Coordinate();
	this.wait = new Map();
	this.quest = new Map();
	this.stat = new Map();
	this.item = new Map();

	this.addWait(ENUM.WAIT_RESPONSE.NOTHING, -1);

	if (typeof chat !== "undefined") {
		VAR.id.set(VAR.id.get(ENUM.ID.CHAT) - 1);
		this.setId(chat.getId());
		this.setName(chat.getName());
		this.setText(chat.getText());
		this.setMoney(chat.getMoney());
		this.setTeleport(chat.getTeleport());
		this.setWait(chat.getWait());
		this.setQuest(chat.getQuest());
		this.setStat(chat.getStat());
		this.setItem(chat.getItem());
	}

	if (!VAR.chats.has(this.getId()))
		VAR.chats.set(this.getId(), this);

	this.getId = function () {
		return this.id;
	}
	this.getName = function () {
		return this.name;
	}
	this.getText = function () {
		return this.text;
	}
	this.getMoney = function () {
		return this.money;
	}
	this.getTeleport = function () {
		return this.teleport;
	}
	this.getWait = function () {
		return this.wait;
	}
	this.getQuest = function () {
		return this.quest;
	}
	this.getStat = function () {
		return this.stawt;
	}
	this.getItem = function () {
		return this.item;
	}

	this.setId = function (id) {
		this.id = FUNC.checkNaN(this.getId(), id, FUNC.line());
	}
	this.setName = function (name) {
		this.name = FUNC.checkType(this.getName(), name, FUNC.line());
	}
	this.setText = function (text) {
		this.text = FUNC.checkType(this.getText(), text, FUNC.line());
	}
	this.setMoney = function (money) {
		this.money = FUNC.checkNaN(this.getMoney(), money, FUNC.line(), 0);
	}
	this.setTeleport = function (teleport) {
		this.teleport = FUNC.checkType(this.getTeleport(), teleport, FUNC.line());
	}
	this.setWait = function (wait) {
		this.wait = FUNC.checkType(this.getWait(), wait, FUNC.line());
	}
	this.setQuest = function (quest) {
		this.quest = FUNC.checkType(this.getQuest(), quest, FUNC.line());
	}
	this.setStat = function (stat) {
		this.stat = FUNC.checkType(this.getStat(), stat, FUNC.line());
	}
	this.setItem = function (item) {
		this.item = FUNC.checkType(this.getItem(), item, FUNC.line());
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(null, money, FUNC.line());
		if (temp !== null) this.setMoney(this.getMoney() + temp);
	}
	this.addWait = function (waitEnum, chatId) {
		var temp = FUNC.checkNaN(null, chatId, FUNC.line());
		this.getWait().set(waitEnum, temp);
	}
	this.addQuest = function (questId, percent) {
		var temp1 = FUNC.checkNaN(null, questId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, percent, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getQuest().get(temp1);

			if (typeof value === "undefined")
				this.getQuest().set(temp1, temp2);
			else
				this.getQuest().set(temp1, value + temp2);
		}
	}
	this.addStat = function (stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line());

		if (temp !== null) {
			var value = this.getStat().get(stat2Enum);

			if (typeof value === "undefined")
				this.getStat().set(stat2Enum, temp);
			else
				this.getStat().set(stat2Enum, value + temp);
		}
	}
	this.addItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(null, itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getItem().get(temp1);

			if (typeof value === "undefined")
				this.getItem().set(temp1, temp2);
			else
				this.getItem().set(temp1, value + temp2);
		}
	}
}

function Npc(name, npc) {
	this.id = FUNC.getId(ENUM.ID.NPC);
	this.name = name;
	this.job = new Map();
	this.coord = new Coordinate();
	this.chat = new Array();
	this.selling = new Map();
	this.easter = new Map();

	if (typeof npc !== "undefined") {
		VAR.id.set(VAR.id.get(ENUM.ID.NPC) - 1);
		this.id = this.setId(npc.getId());
		this.name = this.setId(npc.getName());
		this.coord = this.setId(npc.getCoord());
		this.chat = this.setId(npc.getChat());
		this.job = this.setId(npc.getJob());
		this.selling = this.setId(npc.getSelling());
		this.easter = this.setId(npc.getEaster());
	}

	if (!VAR.npcs.has(this.getId()))
		VAR.npcs.set(this.getId(), this);

	this.getId = function () {
		return this.id;
	}
	this.getName = function () {
		return this.name;
	}
	this.getCoord = function () {
		return this.coord;
	}
	this.getChat = function () {
		return this.chat;
	}
	this.getJob = function () {
		return this.job;
	}
	this.getSelling = function () {
		return this.selling;
	}
	this.getEaster = function () {
		return this.easter;
	}
	this.getChat = function () {
		return this.chat.get("chat");
	}

	this.setId = function (id) {
		this.id = FUNC.checkNaN(this.getId(), id, FUNC.line());
	}
	this.setName = function (name) {
		this.name = FUNC.checkType(this.getName(), name, FUNC.line());
	}
	this.setCoord = function (coord) {
		this.coord = FUNC.checkType(this.getCoord(), coord, FUNC.line());
	}
	this.setChat = function (chat) {
		this.chat = FUNC.checkType(this.getChat(), chat, FUNC.line)
	}
	this.setJob = function (job) {
		this.job = FUNC.checkType(this.getJob(), job, FUNC.line());
	}
	this.setSelling = function (selling) {
		this.selling = FUNC.checkType(this.getSelling(), selling, FUNC.line());
	}
	this.setEaster = function (easter) {
		this.easter = FUNC.checkType(this.getEaster(), easter, FUNC.line());
	}

	this.addJob = function (jobEnum, jobLv) {
		var temp = FUNC.checkNaN(null, jobLv, FUNC.line());

		if (temp !== null) {
			var value = this.getItem().get(jobEnum);

			if (typeof value === "undefined")
				this.getItem().set(jobEnum, temp);
			else
				this.getItem().set(jobEnum, value + temp);
		}
	}
	this.addChat = function (chatId, minLv, minCloseRate, minStat, maxLv, maxCloseRate, maxStat) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, chatId, line);
		var temp2 = FUNC.checkNaN(null, minLv, line, 1, 999);
		var temp3 = FUNC.checkNaN(null, minCloseRate, line, 0, 10000);
		var temp4 = FUNC.checkType_(Map, minStat, line);
		var temp5 = FUNC.checkNaN(null, maxLv, line, 1, 999);
		var temp6 = FUNC.checkNaN(null, maxCloseRate, line, 0, 10000);
		var temp7 = FUNC.checkType_(Map, maxStat, line);
		if (temp1 === null || temp2 === null || temp3 === null || temp4 === null || temp5 === null || temp6 === null || temp7 === null ||
			temp2 > temp5 || temp3 > temp6 || FUNC.checkStat2(temp4, temp7, ENUM.CHECKING.small) || FUNC.checkStat2(temp7, temp4, ENUM.CHECKING.big))
			return;

		var chatMap = new Map();
		chatMap.set("chat", temp1);
		chatMap.set("min", new Map());
		chatMap.set("max", new Map());
		chatMap.get("min").set("lv", temp2);
		chatMap.get("min").set("closeRate", temp3);
		chatMap.get("min").set("stat", temp4);
		chatMap.get("max").set("lv", temp5);
		chatMap.get("max").set("closeRate", temp6);
		chatMap.get("max").set("stat", temp7);
		this.getChat().push(chatMap);
	}
	this.addSellling = function (jobEnum, jobLv, minCloseRate, itemId, itemCount) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, jobLv, line, 1);
		var temp2 = FUNC.checkNaN(null, minCloseRate, line, 0, 10000);
		var temp3 = FUNC.checkNaN(null, itemId, line);
		var temp4 = FUNC.checkNaN(null, itemCount, line);
		if (temp1 === null || temp2 === null || temp3 === null || temp4 === null)
			return;

		if (!this.getSelling().has(jobEnum))
			this.getSelling().set(jobEnum, new Map());
		if (!this.getSelling().get(jobEnum).has(temp1))
			this.getSelling().get(jobEnum).set(temp1, new Map());
		if (!this.getSelling().get(jobEnum).get(temp1).has(temp2))
			this.getSelling().get(jobEnum).get(temp1).set(temp2, new Map());

		var value = this.getSelling().get(jobEnum).get(temp1).get(temp2).get(temp3);
		if (typeof value === "undefined")
			this.getSelling().get(jobEnum).get(temp1).get(temp2).set(temp3, temp4);
		else
			this.getSelling().get(jobEnum).get(temp1).get(temp2).set(temp3, value + temp4);
	}
	this.addEaster = function (questId, percent) {
		var temp1 = FUNC.checkNaN(null, questId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, percent, FUNC.line(), undefined, 1000000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getEaster().get(temp1);

			if (typeof value === "undefined")
				this.getEaster().set(temp1, temp2);
			else
				this.getEaster().set(temp1, value + temp2);
		}
	}

	this.executeEaster = function () {
		var random = FUNC.random(1000000);

		var iterator = this.getEaster().entries();
		var value;
		while (true) {
			value = iterator.next().value;

			if (typeof value === "undefined")
				return -1;
			if (value[1] <= random)
				return value[0];
		}
	}
	this.getAvailableChats = function (playerId) {
		var output = new Array();
		if (FUNC.checkNaN(null, playerId, FUNC.line()) === null)
			return output;

		var player = VAR.players.get(playerId);
		var array = this.getChat().get("chat");

		var lv = player.getLv();
		var closeRate = player.getData().get("closeRate").get(this.getId());
		closeRate = typeof closeRate !== "undefined" ? closeRate : 0;
		var stat = player.getStat();

		var min, max;
		for (var i = 0; i < array.length; i++) {
			min = array[i].get("min");
			max = array[i].get("max");

			if (min.get("lv") <= lv && max.get("lv") >= lv && min.get("closeRate") <= closeRate && max.get("closeRate") >= closeRate &&
				FUNC.checkStat2(min.get("stat"), stat, ENUM.CHECKING.small) && FUNC.checkStat2(max.get("stat"), stat, ENUM.CHECKING.big))
				output.push(array[i].get("chat"))
		}

		return output;
	}
	this.getAvailableSellings = function (jobEnum, playerId) {
		var output = new Map();
		if (FUNC.checkNaN(null, playerId, FUNC.line()) === null || !this.getSelling().has(jobEnum))
			return output;

		var player = VAR.players.get(playerId);
		var iterator1 = this.getSelling().get(jobEnum).entries();
		var iterator2, iterator3;
		var value1, value2, value3;
		var closeRate;
		while (true) {
			value1 = iterator1.next().value;

			if (typeof value1 === "undefined")
				break;
			if (value1[0] > this.getJob().get(jobEnum))
				continue;

			iterator2 = map.get(jobEnum).get(value1[0]).entries();
			while (true) {
				value2 = iterator2.next().value;

				if (typeof value2 === "undefined")
					break;

				closeRate = player.getData().get("closeRate").get(this.getId());
				closeRate = typeof closeRate !== "undefined" ? closeRate : 0;
				if (value2[0] > closeRate)
					continue;

				iterator3 = map.get(jobEnum).get(value1[0]).get(value2[0]).entries();
				while (true) {
					value3 = iterator3.next().value;

					if (typeof value3 === "undefined")
						break;
					if (VAR.items.get(value3[0]).getValue() === -1)
						continue;

					if (output.has(value3[0]))
						output.set(value3[0], output.get(value3[0]) + value3[1]);
					else
						output.set(value3[0], value3[1]);
				}
			}
		}

		return output;
	}
}

function Quest(name, quest) {
	this.id = FUNC.getId(ENUM.ID.QUEST);
	this.name = name;
	this.isClearedOnce = false;
	this.isRepeatable = false;
	this.limit = new Map();
	this.need = new Map();
	this.reward = new Map();

	this.changeLimit(1, new Map(), new Map(), 999, new Map(), new Map());
	this.changeNeed(0, new Map(), new Map());
	this.changeReward(0, 0, 0, new Map(), new Map());

	if (typeof reward !== "undefined") {
		VAR.id.set(VAR.id.get(ENUM.ID.QUEST) - 1);
		this.id = this.setId(quest.getId());
		this.name = this.setName(quest.getname());
		this.isClearedOnce = this.setIsClearedOnce(quest.getIsClearedOnce());
		this.isRepeatable = this.setIsRepeatable(quest.getIsRepeatable());
		this.limit = this.setLimit(quest.getLimit());
		this.need = this.setNeed(quest.getNeed());
		this.reward = this.setReward(quest.getReward());
	}

	if (!VAR.quests.has(this.getId()))
		VAR.quests.set(this.getId(), this);

	this.getId = function () {
		return this.id;
	}
	this.getName = function () {
		return this.name;
	}
	this.getIsClearedOnce = function () {
		return this.isClearedOnce;
	}
	this.getIsRepeatable = function () {
		return this.isRepeatable;
	}
	this.getLimit = function () {
		return this.limit;
	}
	this.getNeed = function () {
		return this.need;
	}
	this.getReward = function () {
		return this.reward;
	}

	this.setId = function (id) {
		this.id = FUNC.checkNaN(this.getId(), id, FUNC.line());
	}
	this.setName = function (name) {
		this.name = FUNC.checkType(this.getName(), name, FUNC.line());
	}
	this.setIsClearedOnce = function (isClearedOnce) {
		this.isClearedOnce = FUNC.checkType(this.getIsClearedOnce(), isClearedOnce, FUNC.line());
	}
	this.setIsRepeatable = function (isRepeatable) {
		this.isRepeatable = FUNC.checkType(this.getIsRepeatable(), isRepeatable, FUNC.line());
	}
	this.setLimit = function (limit) {
		this.limit = FUNC.checkType(this.getLimit(), limit, FUNC.line());
	}
	this.setNeed = function (need) {
		this.need = FUNC.checkType(this.getNeed(), need, FUNC.line());
	}
	this.setReward = function (reward) {
		this.reward = FUNC.checkType(this.getReward(), reward, FUNC.line());
	}
	this.setLimitCloseRate = function (npcId, minCloseRate, maxCloseRate) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, npcId, line);
		var temp2 = FUNC.checkNaN(null, minCloseRate, line, 0, 10000);
		var temp3 = FUNC.checkNaN(null, maxCloseRate, line, 0, 10000);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp2 <= temp3) {
			this.getLimit().get("min").get("closeRate").set(temp1, temp2);
			this.getLimit().get("max").get("closeRate").set(temp1, temp3)
		}
	}
	this.setLimitStat = function (stat2Enum, minStat, maxStat) {
		var temp1 = FUNC.checkNaN(null, minStat, FUNC.line(), 0);
		var temp2 = FUNC.checkNaN(null, maxStat, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null && temp1 <= temp2) {
			this.getStat().get("min").get("stat").set(stat2Enum, temp1);
			this.getStat().get("max").get("stat").set(stat2Enum, temp2);
		}
	}

	this.changeIsClearedOnce = function () {
		if (this.getIsClearedOnce() === false)
			this.setIsClearedOnce(true);
		else
			this.setIsClearedOnce(false);
	}
	this.chagneIsRepeatable = function () {
		if (this.getIsRepeatable() === false)
			this.setIsRepeatable(true);
		else
			this.setIsRepeatable(false);
	}
	this.changeLimit = function (minLv, minStat, minCloseRate, maxLv, maxStat, maxCloseRate) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, minLv, line, 1, 999);
		var temp2 = FUNC.checkNaN(null, minCloseRate, line, 0, 10000);
		var temp3 = FUNC.checkType_(Map, minStat, line);
		var temp4 = FUNC.checkNaN(null, maxLv, line, 1, 999);
		var temp5 = FUNC.checkNaN(null, maxCloseRate, line, 0, 10000);
		var temp6 = FUNC.checkType_(Map, maxStat, line);
		if (temp1 === null || temp2 === null || temp3 === null || temp4 === null || temp5 === null || temp6 === null ||
			temp1 > temp4 || temp2 > temp5 || FUNC.checkStat2(temp3, temp6, ENUM.CHECKING.small) || FUNC.checkStat2(temp6, temp3, ENUM.CHECKING.big))
			return;

		var limitMap = new Map();
		limitMap.set("min", new Map());
		limitMap.set("max", new Map());
		limitMap.get("min").set("lv", temp1);
		limitMap.get("min").set("stat", temp2);
		limitMap.get("min").set("closeRate", temp3);
		limitMap.get("max").set("lv", temp4);
		limitMap.get("max").set("stat", temp5);
		limitMap.get("max").set("closeRate", temp6);
		this.setLimit(limitMap);
	}
	this.changeNeed = function (money, item, closeRate) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, money, line, 0);
		var temp2 = FUNC.checkType_(Map, item, line);
		var temp3 = FUNC.checkType_(Map, closeRate, line);
		if (temp1 === null || temp2 === null || temp3 === null)
			return;

		this.getNeed().set("money", temp1);
		this.getNeed().set("item", temp2);
		this.getNeed().set("closeRate", temp3);
	}
	this.changeReward = function (exp, adv, money, item, stat) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, exp, line);
		var temp2 = FUNC.checkNaN(null, adv, line, 0);
		var temp3 = FUNC.checkNaN(null, money, line, 0);
		var temp4 = FUNC.checkType_(Map, item, line);
		var temp5 = FUNC.checkType_(Map, stat, line);
		if (temp1 === null || temp2 === null || temp3 === null || temp4 === null || temp5 === null)
			return;

		this.getReward().set("exp", temp1);
		this.getReward().set("adv", temp2);
		this.getReward().set("money", temp3);
		this.getReward().set("item", temp4);
		this.getReward().set("stat", temp5);
	}

	this.checkClear = function (playerId) {
		if (FUNC.checkNaN(null, playerId, FUNC.line()) === null)
			return false;

		var player = VAR.players.get(playerId);

		if (this.getNeed().get("money") > player.getMoney())
			return false;

		var iterator = this.getNeed().get("item").entries();
		var value;
		while (true) {
			value = iterator.next().value;

			if (typeof value === "undefined")
				break;
			if (!player.getInventory().has(value[0]) || value[1] > player.getInventory().get(value[0]))
				return false;
		}

		iterator = this.getNeed().get("closeRate").entries();
		var value;
		var closeRate;
		while (true) {
			value = iterator.next().value;

			if (typeof value === "undefined") {
				if (this.getIsClearedOnce() === false) {
					FUNC.reply(player,
						"\"" + this.getName() + "\" 퀘스트 클리어 조건을 만족하셨습니다",
						"이 메세지는 퀘스트 수령 후 최초 클리어 시에만 발송됩니다."
					);
					this.changeIsClearedOnce();
				}

				return true;
			}

			closeRate = player.getData().get("closeRate").get(value[0]);
			closeRate = typeof closeRate !== "undefined" ? closeRate : 0;
			if (value[1] > closeRate)
				return false;
		}
	}

	this.addNeedCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(null, npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, closeRate, FUNC.line(), 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeed().get("closeRate").get(temp1);

			if (typeof value === "undefined")
				this.getNeed().get("closeRate").set(temp1, temp2);
			else
				this.getNeed().get("closeRate").set(temp1, value + temp2);
		}
	}
	this.addNeedItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(null, itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, itemCount, FUNC.line(), 1);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeed().get("item").get(temp1);

			if (typeof value === "undefined")
				this.getNeed().get("item").set(temp1, temp2);
			else
				this.getNeed().get("item").set(temp1, value + temp2);
		}
	}
	this.addRewardItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(null, itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, itemCount, FUNC.line(), 1);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getReward().get("item").get(temp1);

			if (typeof value === "undefined")
				this.getReward().get("item").set(temp1, temp2);
			else
				this.getReward().get("item").set(temp1, value + temp2);
		}
	}
	this.addRewardStat = function (stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line());

		if (temp !== null) {
			var value = this.getReward().get("stat").get(stat2Enum);

			if (typeof value === "undefined")
				this.getReward().get("stat").set(stat2Enum, temp);
			else
				this.getReward().get("stat").set(stat2Enum, value + temp);
		}
	}
}

function Item(id, name, description, item) {
	this.id = FUNC.getId(ENUM.ID.ITEM);
	this.name = name;
	this.description = description;
	this.value = -1;
	this.isEquipment = false;					//변경 불가

	if (typeof item !== "undefined") {
		VAR.id.set(VAR.id.get(ENUM.ID.ITEM) - 1);
		this.id = this.setId(item.getId());
		this.name = this.setName(item.getName());
		this.description = this.setDescription(item.getDescription());
		this.value = this.setValue(item.getValue());
	}

	if (!VAR.items.has(this.getId()))
		VAR.items.set(this.getId(), this);

	this.getId = function () {
		return this.id;
	}
	this.getName = function () {
		return this.name;
	}
	this.getDescription = function () {
		return this.description;
	}
	this.getValue = function () {
		return this.value;
	}
	this.getIsEquipment = function () {
		return this.isEquipment;
	}

	this.setId = function (id) {
		this.id = FUNC.checkNaN(this.getId(), id, FUNC.line());
	}
	this.setName = function (name) {
		this.name = FUNC.checkType(this.getName(), name, FUNC.line());
	}
	this.setDescription = function (description) {
		this.description = FUNC.checkType(this.getDescription(), description, FUNC.line());
	}
	this.setValue = function (value) {
		this.value = FUNC.checkNaN(this.getValue(), value, FUNC.line(), -1);
	}

	this.addValue = function (value) {
		var temp = FUNC.checkNaN(null, value, FUNC.line());
		if (temp !== null) this.setValue(this.getValue() + temp)
	}
}

function Equipment(typeId, name, description, eTypeEnum, item, equipment) {
	this.id = FUNC.getId(ENUM.ID.EQUIPMENT);
	this.typeId = typeId;
	this.name = name;
	this.description = description;
	this.eType = eTypeEnum;
	this.value = -1;
	this.isEquipment = true;
	this.stat = new Map();
	this.limit = new Map();
	this.type = new Map();
	this.reinforce = new Map();

	this.changeLimit(1, new Map());

	if (typeof item !== "undefined") {
		this.typeId = item.getId();
		this.name = item.getname();
		this.description = item.getDescription();
		this.eType = eTypeEnum;
		this.value = item.getValue();
	}

	if (typeof equipment !== "undefined") {
		this.typeId = equipment.getTypeId();
		this.name = equipment.getName();
		this.description = equipment.getDescription();
		this.eType = equipment.getEType();
		this.value = equipment.getValue();
		this.stat = equipment.getStat();
		this.type = equipment.getType();
		this.reinforce = equipment.getReinforce();
	}

	VAR.equipments.set(this.getId(), this);

	this.getId = function () {
		return this.id;
	}
	this.getTypeId = function () {
		return this.typeId;
	}
	this.getName = function () {
		return this.name;
	}
	this.getDescription = function () {
		return this.description;
	}
	this.getEType = function () {
		return this.eType;
	}
	this.getValue = function () {
		return this.value;
	}
	this.getIsEquipment = function () {
		return this.isEquipment;
	}
	this.getStat = function () {
		return this.stat;
	}
	this.getLimit = function () {
		return this.limit;
	}
	this.getType = function () {
		return this.type
	}
	this.getReinforce = function () {
		return this.reinforce
	}

	this.setTypeId = function (typeId) {
		this.typeId = FUNC.checkNaN(this.getTypeId(), typeId, FUNC.line());
	}
	this.setName = function (name) {
		this.typeId = FUNC.checkType(this.getName(), name, FUNC.line());
	}
	this.setDescription = function (description) {
		this.typeId = FUNC.checkType(this.getDescription(), description, FUNC.line());
	}
	this.setEType = function (eTypeEnum) {
		this.typeId = FUNC.checkType(this.getEType(), eTypeEnum, FUNC.line());
	}
	this.setValue = function (value) {
		this.value = FUNC.checkNaN(this.getValue(), value, FUNC.line());
	}
	this.setIsEquipment = function (isEquipment) {
		this.isEquipment = FUNC.checkType(this.getIsEquipment(), isEquipment, FUNC.line());
	}
	this.setStat = function (stat) {
		this.stat = FUNC.checkType(this.getStat(), stat, FUNC.line());
	}
	this.setLimit = function (limit) {
		this.limit = FUNC.checkType(this.getLimit(), limit, FUNC.line());
	}
	this.setType = function (type) {
		this.type = FUNC.checkType(this.getType(), type, FUNC.line());
	}
	this.setReinforce = function (reinforce) {
		this.reinforce = FUNC.checkType(this.getReinforce(), reinforce, FUNC.line());
	}

	this.changeLimit = function (lv, stat) {
		var temp1 = FUNC.checkNaN(null, lv, FUNC.line(), 0);
		var temp2 = FUNC.checkType_(Map, stat, FUNC.line());
		if (temp1 === null || temp2 === null)
			return;

		this.getLimit().set("lv", temp1);
		this.getLimit().set("stat", temp2);
	}
	this.changeReinforce = function (max, reinforce, lvDown) {
		var line = FUNC.line();
		var temp1 = FUNC.checkNaN(null, max, line, 0);
		var temp2 = FUNC.checkType_(Map, reinforce, line);
		var temp3 = FUNC.checkType_(Array, lvDown, line);

		if (temp1 == null || temp2 == null || temp3 == null)
			return;

		this.getReinforce().set("max", temp1);
		this.getReinforce().set("reinforce", temp2);
		this.getReinforce().set("lvDown", temp3);
	}

	this.addValue = function (value) {
		var temp = FUNC.checkNaN(null, value, FUNC.line(), -1);
		if (temp !== null) this.setValue(this.getValue() + temp)
	}
	this.addStat = function (stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line);

		if (temp !== null) {
			var value = this.getStat().get(stat2Enum);

			if (typeof value === "undefined")
				this.getStat().set(stat2Enum, temp);
			else
				this.getStat().set(stat2Enum, value + temp);
		}
	}
	this.addLimitStat = function (stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line);

		if (temp !== null) {
			var value = this.getLimit().get("stat").get(stat2Enum);

			if (typeof value === "undefined")
				this.getLimit().get("stat").set(stat2Enum, temp);
			else
				this.getLimit().get("stat").set(stat2Enum, value + temp);
		}
	}
	this.addType = function (typeEnum, typeLv) {
		var temp = FUNC.checkNaN(null, typeLv, FUNC.line(), 0);
		if (temp === null) return;

		var level = this.getType().get(typeEnum);
		if (typeof level === "undefined")
			this.getType().set(typeEnum, typeLv);
		else
			this.getType().set(typeEnum, level + value)
	}
	this.addReinforce = function (stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line);

		if (temp !== null) {
			var value = this.getReinforce().get("reinforce").get(stat2Enum);

			if (typeof value === "undefined")
				this.getReinforce().get("reinforce").set(stat2Enum, temp);
			else
				this.getReinforce().get("reinforce").set(stat2Enum, value + temp);
		}
	}
	this.addReinforceLvDown = function (lvDown) {
		var temp = FUNC.checkNaN(null, lvDown, FUNC.line());
		if (temp !== null) this.getReinforce.get("lvDown").push(lvDown);
	}
}

function Player(nickName, name, image, room, player) {
	this.id = FUNC.getId(ENUM.ID.PLAYER);
	this.nickName = nickName;
	this.name = name;
	this.image = image;
	this.recentRoom = room;
	this.lastTime = FUNC.time();
	this.coord = new Coordinate();
	this.title = "";
	this.money = 0;
	this.lv = 1;
	this.exp = 0;
	this.sp = 10;
	this.adv = 0;
	this.doing = ENUM.DOING.NONE;
	this.job = new Map();
	this.stat = new Map();
	this.inventory = new Map();
	this.equiped = new Map();
	this.quest = new Map();
	this.data = new Map();
	this.buff = new Map();

	var mainMap = new Map();
	var resistMap = new Map();

	for (var i = 0; i < ENUM.STAT1.max; i++) {
		mainMap.set(i, new Map());

		for (var j = 0; j < ENUM.STAT2.max; j++)
			mainMap.get(i).set(j, 0);
	}

	for (var i = 0; i < ENUM.TYPE.max; i++)
		resistMap.set(i, 0);

	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxhp, 100);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.hp, 100);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxmn, 1000);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mn, 1000);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxeg, 100);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.eg, 100);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.atk, 10);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.matk, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.def, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mdef, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.bre, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mbre, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.dra, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mdra, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.cd, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.spd, 100);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.eva, 0);
	mainMap.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.acc, 0);
	this.changeStat(mainMap, resistMap);

	if (typeof player !== "undefined") {
		VAR.id.set(VAR.id.get(ENUM.ID.PLAYER) - 1);
		this.setId(player.getId());
		this.nickName = player.getNickName();
		this.name = name;
		this.image = image;
		this.recentRoom = room;
		this.lastTime = player.getLastTime();
		this.coord = player.getCoord();
		this.title = player.getTitle();
		this.money = player.getMoney();
		this.lv = player.getLv();
		this.exp = player.getExp();
		this.sp = player.getSp();
		this.adv = player.getAdv();
		this.doing = player.getDoing();
		this.job = player.getJob();
		this.stat = player.getStat();
		this.inventory = player.getInventory();
		this.equiped = player.getEquiped();
		this.quest = player.getQuest();
		this.data = player.getData();
		this.buff = player.getBuff();
	}

	this.getId = function () {
		return this.id;
	}
	this.getNickName = function () {
		return this.nickName;
	}
	this.getName = function () {
		return this.name;
	}
	this.getImage = function () {
		return this.image;
	}
	this.getLastTime = function () {
		return this.lastTime;
	}
	this.getRecentRoom = function () {
		return this.recentRoom;
	}
	this.getCoord = function () {
		return this.coord;
	}
	this.getTitle = function () {
		return this.title;
	}
	this.getMoney = function () {
		return this.money;
	}
	this.getLv = function () {
		return this.lv;
	}
	this.getExp = function () {
		return this.exp;
	}
	this.getSp = function () {
		return this.sp;
	}
	this.getAdv = function () {
		return this.adv;
	}
	this.getDoing = function () {
		return this.doing;
	}
	this.getJob = function () {
		return this.job;
	}
	this.getStat = function () {
		return this.stat;
	}
	this.getInventory = function () {
		return this.inventory;
	}
	this.getEquiped = function () {
		return this.equiped
	}
	this.getQuest = function () {
		return this.quest;
	}
	this.getData = function () {
		return this.data;
	}
	this.getBuff = function () {
		return this.buff;
	}

	//return main total stat
	this.getMainStat = function (stat2Enum) {
		return this.getStat().get("main").get(ENUM.STAT1.totalStat).get(stat2Enum);
	}

	this.setId = function (id) {
		this.id = FUNC.checkNaN(this.getId(), id, FUNC.line());
	}
	this.setNickName = function (nickName) {
		this.nickName = FUNC.checkType(this.getNickName(), nickName, FUNC.line());
	}
	this.setName = function (name) {
		this.name = FUNC.checkNaN(this.getName(), name, FUNC.line());
	}
	this.setImage = function (image) {
		this.image = FUNC.checkNaN(this.getImage(), image, FUNC.line());
	}
	this.setLastTime = function (lastTime) {
		this.lastTime = FUNC.checkNaN(this.getLastTime(), lastTime, FUNC.line());
	}
	this.setRecentRoom = function (recentRoom) {
		this.recentRoom = FUNC.checkNaN(this.getRecentRoom(), recentRoom, FUNC.line());
	}
	this.setCoord = function (coord) {
		this.coord = FUNC.checkNaN(this.getCoord(), coord, FUNC.line());
	}
	this.setTitle = function (title) {
		this.title = FUNC.checkNaN(this.getTitle(), title, FUNC.line());
	}
	this.setMoney = function (money) {
		this.money = FUNC.checkNaN(this.getMoney(), money, FUNC.line());
	}
	this.setLv = function (lv) {
		this.lv = FUNC.checkNaN(this.getLv(), lv, FUNC.line());
	}
	this.setExp = function (exp) {
		this.exp = FUNC.checkNaN(this.getExp(), exp, FUNC.line());
	}
	this.setSp = function (sp) {
		this.sp = FUNC.checkNaN(this.getSp(), sp, FUNC.line());
	}
	this.setAdv = function (adv) {
		this.adv = FUNC.checkNaN(this.getAdv(), adv, FUNC.line());
	}
	this.setDoing = function (doing) {
		this.doing = FUNC.checkNaN(this.getDoing(), doing, FUNC.line());
	}
	this.setJob = function (job) {
		this.job = FUNC.checkNaN(this.getJob(), job, FUNC.line());
	}
	this.setStat = function (stat) {
		this.stat = FUNC.checkNaN(this.getStat(), stat, FUNC.line());
	}
	this.setInventory = function (inventory) {
		this.inventory = FUNC.checkNaN(this.getInventory(), inventory, FUNC.line());
	}
	this.setEquiped = function (equiped) {
		this.equiped = FUNC.checkNaN(this.getEquiped(), equiped, FUNC.line());
	}
	this.setQuest = function (quest) {
		this.quest = FUNC.checkNaN(this.getQuest(), quest, FUNC.line());
	}
	this.setData = function (data) {
		this.data = FUNC.checkNaN(this.getData(), data, FUNC.line());
	}
	this.setBuff = function (buff) {
		this.buff = FUNC.checkNaN(this.getBuff(), buff, FUNC.line());
	}

	this.changeStat = function (main, resist) {
		var line = FUNC.line();
		var temp1 = FUNC.checkType_(Map, main, line);
		var temp2 = FUNC.checkType_(Map, resist, line);
		if (temp1 === null || temp2 === null)
			return;

		this.getStat().set("main", temp1);
		this.getStat().set("resist", temp2);
	}
	this.changeQuest = function (now, cleared) {
		var line = FUNC.line();
		if (FUNC.checkType_(Array, now, line) === null || FUNC.checkType_(Map, cleared, line) === null)
			return;

		this.getQuest().set("now", now);
		this.getQuest().set("cleared", cleared);
	}
	this.changeData = function (achieve, research, title, closeRate, log) {
		var line = FUNC.line();
		if (FUNC.checkType_(Array, achieve, line) === null || FUNC.checkType_(Array, research, line) === null || FUNC.checkType_(Array, title, line) === null ||
			FUNC.checkType_(Map, closeRate, line) === null || FUNC.checkType_(Map, log, line) === null)
			return;

		this.getData().set("achieve", achieve);
		this.getData().set("research", research);
		this.getData().set("title", title);
		this.getData().set("closeRate", closeRate);
		this.getData().set("log", log);
	}
	this.changeBuff = function (buff, debuff, type) {
		var line = FUNC.line();
		if (FUNC.checkType_(Map, buff, line) === null || FUNC.checkType_(Map, debuff, line) === null || FUNC.checkType_(Map, type, line) === null)
			return;

		this.getBuff().set("buff", buff);
		this.getBuff().set("debuff", debuff);
		this.getBuff().set("type", type);
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(null, money, FUNC.line());
		if (temp !== null) this.setMoney(this.getMoney + temp);
	}
	this.addLv = function (lv) {
		var temp = FUNC.checkNaN(null, lv, FUNC.line());
		if (temp !== null) this.setLv(this.getLv() + temp);
	}
	this.addExp = function (exp) {
		var temp = FUNC.checkNaN(null, exp, FUNC.line());
		if (temp !== null) this.setExp(this.getExp() + temp);
	}
	this.addSp = function (sp) {
		var temp = FUNC.checkNaN(null, sp, FUNC.line());
		if (temp !== null) this.setSp(this.getSp() + temp);
	}
	this.addAdv = function (adv) {
		var temp = FUNC.checkNaN(null, adv, FUNC.line());
		if (temp !== null) this.setAdv(this.getAdv() + temp);
	}
	this.addJob = function (jobEnum, jobLv) {
		var temp = FUNC.checkNaN(null, jobLv, FUNC.line(), 1);

		if (temp !== null) {
			var value = this.getJob().get(jobEnum);

			if (typeof value === "undefined")
				this.getJob().set(jobEnum, temp);
			else
				this.getJob().set(jobEnum, value + temp);
		}
	}
	this.addMainStat = function (stat1Enum, stat2Enum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line());

		if (temp !== null) {
			var value = this.getStat().get("main").get(stat1Enum).get(stat2Enum);
			this.getStat().get("main").get(stat1Enum).set(stat2Enum, value + temp);
		}
	}
	this.addResistStat = function (typeEnum, stat) {
		var temp = FUNC.checkNaN(null, stat, FUNC.line());

		if (temp !== null) {
			var value = this.getStat().get("resist").get(typeEnum);
			this.getStat().get("resist").set(typeEnum, value + temp);
		}
	}
	this.addInventory = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(null, itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getInventory().get(temp1);

			if (typeof value === "undefined")
				this.getInventory.set(temp1, temp2);
			else
				this.getInventory.set(temp1, value + temp2);
		}
	}
	this.addNowQuest = function (questId) {
		var temp = FUNC.checkNaN(null, questId, FUNC.line());
		if (temp !== null) this.getQuest().get("now").push(questId);
	}
	this.addClearedQuest = function (questId, clearTime) {
		var temp1 = FUNC.checkNaN(null, questId, FUNC.line());
		var temp2 = FUNC.checkNaN(null, clearTime, FUNC.line(), 1);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getQuest().get("cleared").get(temp1);

			if (typeof value === "undefined")
				this.getQuest().get("cleared").set(temp1, temp2);
			else
				this.getQuest().get("cleared").set(temp1, value + temp2);
		}
	}
	this.addAchieve = function (achieveId) {
		var temp = FUNC.checkNaN(null, achieveId, FUNC.line());
		if (temp !== null) this.getData().get("achieve").push(temp);
	}
	this.addResearch = function (researchId) {
		var temp = FUNC.checkNaN(null, researchId, FUNC.line());
		if (temp !== null) this.getData().get("research").push(temp);
	}
	this.addTitle = function (title) {
		var temp = FUNC.checkType_(String, title, FUNC.line());
		if (temp !== null) this.getData().get("title").push(temp);
	}
	this.addCloseRate = function (npcId, closeRate) {

	}
	this.addLog = function (data, count) {

	}
	this.addBuff = function (length, stat2Enum, stat) {

	}
	this.addDebuff = function (length, stat2Enum, stat) {

	}
	this.addBuffType = function (length, typeEnum, typeLv) {

	}

	this.getNeedExp = function () {

	}
	this.checkLvUp = function () {

	}
	this.levelUp = function () {

	}
	this.canAddQuest = function (questId) {

	}
	this.canAddAchieve = function (achieveId) {

	}
	this.canAddResearch = function (researchId) {

	}
	this.canAddTitle = function (title) {

	}
	this.clearQuest = function (questId) {

	}
	this.canEquip = function (equipmentId) {

	}
	this.equip = function (equipmentId) {

	}
	this.handleQuest = function () {

	}
	this.handleAchieve = function () {

	}
	this.handleResearch = function () {

	}
	this.handleBuff = function () {

	}
	this.update = function () {

	}
	this.updateStat = function () {

	}
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
	if (isGroupChat)
		return;


}


function onStartCompile() {
	FUNC.loadDB();
}
function onCreate(savedInstanceState, activity) { }
function onResume(activity) { }
function onPause(activity) {
	FUNC.saveDB();
}
function onStop(activity) {
	FUNC.saveDB();
}
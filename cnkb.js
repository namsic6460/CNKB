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

	checkType: function (func, variable, line) {
		var funcName = this.getFuncName(func);
		var varFuncName = variable.constructor.name;

		if (funcName !== varFuncName) {
			this.log("Type Error - (func : " + funcName + ", variable : " + varFuncName + ")", line, ENUM.LOG.error);
			return null;
		}

		return variable;
	},

	checkNaN: function (variable, line, min, max) {
		if (isNaN(variable) || (typeof min !== "undefined" && variable < min) || (typeof max !== "undefined" && variable > max)) {
			this.log("NaN Error - (variable : " + variable + ")", line, ENUM.LOG.error);
			return null;
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
			text + VAR.all + "----------\n" + more, true);
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
		"equipment": 5,
		"achieve": 6,
		"research": 7
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
	this.x = this.setX(x);
	this.y = this.setY(y);

	this.getX = function () {
		return this.x;
	}
	this.getY = function () {
		return this.y;
	}

	this.setX = function (x) {
		var temp = FUNC.checkNaN(x, FUNC.line(), 0);
		if (temp !== null) this.x = temp;
	}
	this.setY = function (y) {
		var temp = FUNC.checkNaN(y, FUNC.line(), 0);
		if (temp !== null) this.y = temp;
	}

	this.addX = function (x) {
		var temp = FUNC.checkNaN(x, FUNC.line());
		if (temp !== null) this.setX(this.x + temp);
	}
	this.addY = function (y) {
		var temp = FUNC.checkNaN(y, FUNC.line());
		if (temp !== null) this.setY(this.y + temp);
	}
}

function Chat(name, text, chat) {
	if (typeof chat === "undefined") {
		this.id = this.setId(FUNC.getId(ENUM.id));
		this.name = this.setName(name);
		this.text = this.setText(text);
		this.percentTotal = 0;
		this.money = 0;
		this.teleport = new Coordinate();
		this.wait = new Map();
		this.quest = new Map();
		this.stat = new Map();
		this.item = new Map();

		this.setWait(ENUM.WAIT_RESPONSE.nothing, -1);
		FUNC.log("Created New Chat - (id : " + id + ", name : " + name + ")", FUNC.line(), ENUM.LOG.info);
	}

	else {
		this.id = chat.id;
		this.name = chat.name;
		this.text = chat.text;
		this.percentTotal = chat.percentTotal;
		this.money = chat.money
		this.teleport = chat.teleport
		this.wait = chat.wait;
		this.quest = chat.quest;
		this.stat = chat.stat;
		this.item = chat.item;

		FUNC.log("Copied Chat - (id : " + id + ", name : " + name + ")", FUNC.line(), ENUM.LOG.info);
	}

	this.getWait = function (waitEnum) {
		var temp = FUNC.checkNaN(null, waitEnum, FUNC.line());
		return this.wait.get(temp);
	}
	this.getQuest = function (questId) {
		var temp = FUNC.checkNaN(null, questId, FUNC.line());
		return this.quest.get(temp);
	}
	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.quest.get(temp);
	}
	this.getItem = function (itemId) {
		var temp = FUNC.checkNaN(null, itemId, FUNC.line());
		return this.quest.get(temp);
	}

	this.setId = function (id) {
		var temp = FUNC.checkNaN(this.getId(), id, FUNC.line());
		if (temp !== null) this.id = id;
	}
	this.setName = function (name) {
		var temp = FUNC.checkType(String, name, FUNC.line());
		if (temp !== null) this.name = name;
	}
	this.setText = function (text) {
		var temp = FUNC.checkType(String, text, FUNC.line());
		if (temp !== null) this.text = text;
	}
	this.setMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.money = money;
	}
	this.setTeleport = function (teleport) {
		var temp = FUNC.checkType(Coordinate, teleport, FUNC.line());
		if (temp !== null) this.teleport = teleport;
	}
	this.setWait = function (waitEnum, chatId, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(waitEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(chatId, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (ignore === false && typeof this.getWait(temp1) !== "undefined")
				return;
			this.wait.set(temp1, temp2);
		}
	}
	this.setQuest = function (questId, percent, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(questId, FUNC.line());
		var temp2 = FUNC.checkNaN(percent, FUNC.line(), 1);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getQuest(temp1);
			if (ignore === false && typeof value !== "undefined")
				return;

			this.totalStat -= value;
			this.totalStat += temp2;
			this.quest.set(temp1, temp2);
		}
	}
	this.setStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (ignore === false && typeof this.getStat(temp1) !== "undefined")
				return;
			this.quest.set(temp1, temp2);
		}
	}
	this.setItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (ignore === false && typeof this.getItem(temp1) !== "undefined")
				return;
			this.quest.set(temp1, temp2);
		}
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.setMoney(this.money + money);
	}
	this.addQuestPercent = function (questId, percent, setZero) {
		setZero = typeof setZero === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(questId, FUNC.line());
		var temp2 = FUNC.checkNaN(percent, FUCN.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getQuest(temp1);

			if (typeof value === "undefined") {
				if (setZero)
					value = 0;
				else {
					FUNC.log("addQuestPercent Warning", FUNC.line(), ENUM.LOG.warning);
					return;
				}
			}

			this.setQuest(temp1, value + temp2, true);
		}
	}
	this.addStatStat = function (stat2Enum, stat, setZero) {
		setZero = typeof setZero === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				if (setZero)
					value = 0;
				else {
					FUNC.log("addStatStat Warning", FUNC.line(), ENUM.LOG.warning);
					return;
				}
			}

			this.setStat(temp1, value + temp2, true);
		}
	}
	this.addItemCount = function (itemId, itemCount, setZero) {
		setZero = typeof setZero === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				if (setZero)
					value = 0;
				else {
					FUNC.log("addItemCount Warning", FUNC.line(), ENUM.LOG.warning);
					return;
				}
			}

			this.setItem(temp1, value + temp2, true);
		}
	}

	this.executeQuest = function () {
		var random = FUNC.random(this.percentTotal);
		var compare = 0;

		var iterator = this.quest.entries();
		var value;
		while (true) {
			value = iterator.next().value;

			if (typeof value === "undefined") {
				FUNC.log("executeQuest Error", FUNC.line(), ENUM.LOG.error);
				return;
			}

			compare += value[1];
			if (compare <= random)
				return value[0];
		}
	}
}

function Npc(name, npc) {
	if (typeof npc === "undefined") {
		this.id = FUNC.getId(ENUM.ID.npc);
		this.name = name;
		this.coord = new Coordinate();
		this.job = new Map();
		this.chat = new Array();
		this.selling = new Map();

		FUNC.log("Created New Npc - (id : " + id + ", name : " + name + ")", FUNC.line(), ENUM.LOG.info);
	}

	else {
		this.id = npc.id;
		this.name = npc.name;
		this.coord = npc.coord;
		this.job = npc.get
		this.chat = npc.chat;
		this.selling = npc.selling;

		FUNC.log("Copied Chat - (id : " + id + ", name : " + name + ")", FUNC.line(), ENUM.LOG.info);
	}

	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum, FUNC.line());
		return this.job.get(temp);
	}
	this.getChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, FUNC.line());

		if (temp !== null) {
			for (var i = 0; i < this.chat.length; i++) {
				if (this.chat[i].get("chat") === temp)
					return i;
			}
		}

		return undefined;
	}
	this.getSelling = function (jobEnum, jobLv, minCloseRate, itemId) {
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line(), 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, FUNC.line(), 0, 10000);
		var temp4 = FUNC.checkNaN(itemId, FUNC.line());

		if (temp1 === null) {
			var iterator1 = this.selling.entries();
			var value1;

			while (true) {
				value1 = iterator1.next().value;

				if (typeof value1 === "undefined") {
					
				}
			}
		}

		return undefined;
	}
}

function Quest(name) {

}

function Item(id, name, description) {

}

function Equipment(typeId, name, description, eTypeEnum) {

}

function Player(nickName, name, image, room, player) {

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
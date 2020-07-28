const scriptName = "cnkb.js";

const kalingModule = require("kaling.js").Kakao();
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
		if (isNaN(parseInt(variable, 10)) || (typeof min !== "undefined" && variable < min) || (typeof max !== "undefined" && variable > max)) {
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

	check: function (original, comparing, checking, ignore) {	//checking이 small이라면 compare이 original에 비해 더 작을 때 true
		ignore = typeof ignore !== "undefined" ? ignore : true;

		var iterator = original.entries();
		var value, compare;

		while (typeof (value = iterator.next().value) !== "undefined") {
			if (!comparing.has(value[0])) {
				if (!ignore)
					return false;
				continue;
			}

			if (value[1] > comparing.get(value[1]))
				compare = ENUM.CHECKING.small;
			else if (value[1] < com)
				compare = ENUM.CHECKING.big;
			else
				continue;

			if (compare !== checking)
				return false;
		}
	},

	reply: function (player, text, more) {
		var str = player.getFullName() + "\n" + text;
		if (typeof more !== "undefined")
			str += VAR.all + "----------\n" + more;

		Api.replyRoom(player.recentRoom, str, true);
	},

	time: function () {
		return Date.now();
	},

	sleep: function (millis) {
		java.lang.Thread.sleep(millis);
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
		"quickStat": 3,			//일시적으로 저장되는 스텟
		"actStat": 4,			//활동으로 얻는 스텟(퀘스트, 대화, 연구, 업적 등등)
		"increStat": 5,			//레벨 스텟 + 이큅 스텟 + 퀵 스텟 + 액트 스텟
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

function Chat(chat) {
	if (typeof chat === "undefined") {
		this.id = FUNC.getId(ENUM.id);
		this.totalPercent = 0;
		this.pause = 0;
		this.quest = -1;
		this.money = 0;
		this.teleport = new Coordinate();
		this.text = new Array();
		this.wait = new Array();
		this.chat = new Map();
		this.stat = new Map();
		this.item = new Map();

		this.wait[0] = ENUM.WAIT_RESPONSE.nothing;
		FUNC.log("Created New Chat - (id : " + this.id + ")", FUNC.line());
	}

	else {
		this.id = chat.id;
		this.totalPercent = chat.totalPercent;
		this.pause = chat.pause;
		this.quest = chat.quest;
		this.money = chat.money
		this.teleport = chat.teleport
		this.text = chat.text;
		this.wait = chat.wait;
		this.stat = chat.stat;
		this.item = chat.item;

		FUNC.log("Copied Chat - (id : " + this.id + ")", FUNC.line());
	}

	if (!VAR.chats.has(this.id))
		VAR.chats.set(this.id, this);

	this.getChat = function (response) {
		var temp = FUNC.checkType(String, response, FUNC.line());
		return this.chat.get(temp);
	}
	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.stat.get(temp);
	}
	this.getItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, FUNC.line());
		return this.item.get(temp);
	}

	this.setPause = function (pause) {
		var temp = FUNC.checkNaN(pause, FUNC.line(), 0);
		if (temp !== null) this.pause = temp;
	}
	this.setQuest = function (questId) {
		var temp = FUNC.checkNaN(questId, FUNC.line());
		if (temp !== null) this.quest = temp;
	}
	this.setMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.money = temp;
	}
	this.setTeleport = function (x, y) {
		var temp1 = FUNC.checkNaN(x, FUNC.line(), 0);
		var temp2 = FUNC.checkNaN(y, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			this.teleport.setX(temp1);
			this.teleport.setY(temp2);
		}
	}
	this.setChat = function (response, chatId, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkType(String, response, FUNC.line());
		var temp2 = FUNC.checkNaN(chatId, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getChat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.chat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.chat.set(temp1, temp2);
		}
	}
	this.setStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.stat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.stat.set(temp1, temp2);
		}
	}
	this.setItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.item.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.item.set(temp1, temp2);
		}
	}

	this.addMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.setMoney(this.money + money);
	}
	this.addText = function (text) {
		var temp = FUNC.checkType(String, text, FUNC.line());
		if (temp !== null) this.text.push(temp);
	}
	this.addWait = function (waitEnum) {
		var temp = FUNC.checkNaN(waitEnum, FUNC.line());

		if (temp !== null) {
			var length = this.wait.length;
			for (var i = 0; i < length; i++) {
				if (this.wait[i] === temp) {
					FUNC.log("addWait Warning", FUNC.line(), ENUM.LOG.warning);
					return;
				}
			}

			this.wait.push(temp);
		}
	}
	this.addStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addStat Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setStat(temp1, value + temp2, true);
		}
	}
	this.addItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addItem Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			var result = value + temp2;
			result = result < 0 ? 0 : result;
			this.setItem(temp1, result, true);
		}
	}

	//TODO move to Player
	this.sendText = function (player, npcName) {
		var length = this.text.length;
		for (var i = 0; i < length; i++) {
			var str = npcName + " : \"" + this.text + "\"";

			if (i - 1 === length) {
				var sub = "대화 전송이 종료되었습니다";

				if (this.wait.length !== 1 || this.wait[0] !== ENUM.WAIT_RESPONSE.nothing)
					sub += "\n입력을 해야 대화가 종료됩니다";

				var result = player.getFullName();
				if (this.teleport !== null) {
					player.setCoord(this.teleport.getX(), this.teleport.getY());
					result += "- 순간이동 완료\n";
				}

				var iterator = this.stat.entries();
				var temp = false;
				var value;
				while (typeof (value = iterator.next().value) !== "undefined") {
					if (!temp) {
						result += "- 스텟 설정 완료\n";
						temp = true;
					}

					player.addStat(ENUM.STAT1.actStat, value[0], value[1]);
				}

				iterator = this.item.entries();
				temp = false;
				while (typeof (value = iterator.next().value) !== "undefined") {
					if (!temp) {
						result += "- 아이템 갯수 설정 완료";
						temp = true;
					}

					player.addItem(value[0], value[1]);
				}

				player.addMoney(this.money);
				FUNC.reply(player, str, sub);

				result = result.substring(0, result.length - 1);
				if (!result.includes("\n"))
					FUNC.reply(player, result);

				return;
			}

			FUNC.reply(player, str);
			FUNC.sleep(this.pause);
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

		FUNC.log("Created New Npc - (id : " + this.id + ", name : " + name + ")", FUNC.line());
	}

	else {
		this.id = npc.id;
		this.name = npc.name;
		this.coord = npc.coord;
		this.job = npc.get
		this.chat = npc.chat;
		this.selling = npc.selling;

		FUNC.log("Copied Chat - (id : " + this.id + ", name : " + name + ")", FUNC.line());
	}

	if (!VAR.npcs.has(this.id))
		VAR.npcs.set(this.id, this);

	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, FUNC.line());

		if (temp !== null) {
			var length = this.chat.length;
			for (var i = 0; i < length; i++) {
				if (this.chat[i].get("chat") === temp)
					return this.chat[i];
			}
		}

		return undefined;
	}
	this.getSelling = function (jobEnum, jobLv, minCloseRate, itemId) {
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line(), 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, FUNC.line(), 0, 10000);
		var temp4 = FUNC.checkNaN(itemId, FUNC.line());

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && this.selling.has(temp1) &&
			this.selling.get(temp1).has(temp2) && this.selling.get(temp1).get(temp2).has(temp3))
			return this.selling.get(temp1).get(temp2).get(temp3).get(temp4);

		return undefined;
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name, FUNC.line());
		if (temp !== null) this.name = temp;
	}
	this.setCoord = function (x, y) {
		var temp1 = FUNC.checkNaN(x, FUNC.line(), 0);
		var temp2 = FUNC.checkNaN(y, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			this.coord.setX(temp1);
			this.coord.setY(temp2);
		}
	}
	this.setJob = function (jobEnum, jobLv, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line(), 1, 100);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getJob(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.job.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.job.set(temp1, temp2);
		}
	}
	this.setSelling = function (jobEnum, jobLv, minCloseRate, itemId, itemCount, ignore) {
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line(), 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, FUNC.line(), 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, FUNC.line());
		var temp5 = FUNC.checkNaN(itemCount, FUNC.line());

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

				if (!ignore)
					return;
			}

			this.selling.get(temp1).get(temp2).get(temp3).set(temp4, temp5);
		}
	}

	this.addJobLv = function (jobEnum, jobLv) {
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getJob(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addJobLv Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setJob(temp1, value + temp2, true);
		}
	}
	this.addChat = function (chatId, percent, minLv, minCloseRate, minStat, minQuest, maxLv, maxCloseRate, maxStat, maxQuest) {
		var temp1 = FUNC.checkNaN(chatId, FUNC.line());
		var temp2 = FUNC.checkNaN(percent, FUNC.line(), 1);
		var temp3 = FUNC.checkNaN(minLv, FUNC.line(), 1, 999);
		var temp4 = FUNC.checkNaN(minCloseRate, FUNC.line(), 1, 10000);
		var temp5 = FUNC.checkType(Map, minStat, FUNC.line());
		var temp6 = FUNC.checkType(Map, minQuest, FUNC.line());
		var temp7 = FUNC.checkNaN(maxLv, FUNC.line(), 1, 999);
		var temp8 = FUNC.checkNaN(maxCloseRate, FUNC.line(), 1, 10000);
		var temp9 = FUNC.checkType(Map, maxStat, FUNC.line());
		var temp10 = FUNC.checkType(Map, maxQuest, FUNC.line());

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null &&
			temp6 !== null && temp7 !== null && temp8 !== null && temp9 !== null && temp10 !== null &&
			temp3 <= temp7 && temp4 <= temp8 && FUNC.check(temp5, temp9, ENUM.CHECKING.big) &&
			FUNC.check(temp6, temp10, ENUM.CHECKING.big)) {
			var value = this.getChat(temp1);

			if (typeof value !== "undefined") {
				FUNC.log("addChat Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

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

			this.chat.push(map);
		}
	}
	this.addSelling = function (jobEnum, jobLv, minCloseRate, itemId, itemCount) {
		var temp1 = FUNC.checkNaN(jobEnum, FUNC.line());
		var temp2 = FUNC.checkNaN(jobLv, FUNC.line(), 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, FUNC.line(), 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, FUNC.line());
		var temp5 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null) {
			var value = this.getSelling(temp1, temp2, temp3, temp4);

			if (typeof value !== "undefined") {
				FUNC.log("addSelling Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setSelling(temp1, temp2, temp3, temp4, temp5, true)
		}
	}

	this.getAvailableChat = function (playerId) {
		var output = new Array();
		var temp1 = FUNC.checkNaN(playerId, FUNC.line());

		if (temp1 !== null) {
			var player = VAR.players.get(temp1);
			var lv = player.lv;
			var closeRate = player.getCloseRate(this.id);
			var stat = player.mainStat.get(ENUM.STAT1.totalStat);
			var quest = player.clearedQuest;

			var length = this.chat.length;
			for (i = 0; i < length; i++) {
				if (this.chat[i].get("minLv") <= lv && this.chat[i].get("maxLv") >= lv &&
					this.chat[i].get("minCloseRate") <= closeRate && this.chat[i].get("maxCloseRate") >= closeRate &&
					FUNC.check(this.chat[i].get("minStat"), stat, ENUM.CHECKING.big, false) &&
					FUNC.check(this.chat[i].get("minQuest"), quest, ENUM.CHECKING.big, false))
					output.push(this.chat[i].get("chat"));
			}
		}

		return output;
	}
	this.getAvailableSelling = function (playerId, jobEnum) {
		var output = new Map();
		var temp1 = FUNC.checkNaN(playerId, FUNC.line());
		var temp2 = FUNC.checkNaN(jobEnum, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var map = this.selling.get(temp2);
			var player = VAR.players.get(temp1);
			var closeRate = player.getCloseRate(this.id);
			var jobLv = this.getJob(temp2);

			var iterator1, iterator2, iterator3;
			var value1, value2, value3, value;

			iterator1 = map.entries();

			while (typeof (value1 = iterator1.next().value) !== "undefined") {
				if (value1[0] <= jobLv) {
					iterator2 = value1[1].entries();

					while (typeof (value2 = iterator2.next().value) !== "undefined") {
						if (value2[0] <= closeRate) {
							itreator3 = value2[1].entries();

							while (typeof (value3 = iterator3.next().value) !== "undefined") {
								if (typeof value === "undefined")
									output.set(value3[0], value3[1]);
								else
									output.set(value3[0], value + value3[1]);
							}
						}
					}
				}
			}
		}

		return output;
	}

	//TODO move to Player
	this.executeChat = function (playerId) {
		var temp = FUNC.checkNaN(playerId, FUNC.line());

		if (temp === null) {
			FUNC.log("executeChat Error", FUNC.line(), ENUM.LOG.error);
			return;
		}

		var availableChat = this.getAvailableChat(temp);
		var totalPercent = 0;
		var chatId = -1;

		var value;
		var length = availableChat.length;
		for (var i = 0; i < length; i++) {
			value = availableChat[i].get("percent");

			if (value !== -1)
				totalPercent += value;

			else {
				chatId = availableChat[i].get("chat");
				break;
			}
		}

		if (chatId === -1) {
			var random = FUNC.random(totalPercent);

			var value = 0;
			for (var i = 0; i < length; i++) {
				value += availableChat[i].get("percent");

				if (value >= random) {
					chatId = availableChat[i].get("chat");
					break;
				}
			}
		}

		var chat = VAR.chats.get(chatId);
		var player = VAR.chats.get(temp);
		var room = player.recentRoom;

		player.setDoing(ENUM.DOING.chat);
		chat.sendText(player, this.name, room);

		if (chat.wait.length !== 1 || chat.wait[0] === ENUM.WAIT_RESPONSE.nothing)
			player.setNowChat(chatId);
	}
}

function Quest(name, quest) {
	if (typeof quest !== "undefined") {
		this.id = FUNC.getId(ENUM.ID.quest);
		this.name = name;
		this.isClearedOnce = false;
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
		this.needCloseRate = new Map();
		this.rewardItem = new Map();
		this.rewardStat = new Map();

		FUNC.log("Created New Quest - (id : " + this.id + ", name : " + name + ")", FUNC.line());
	}

	else {
		this.id = quest.id;
		this.name = quest.name;
		this.isClearedOnce = quest.isClearedOnce;
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
		this.needCloseRate = quest.needCloseRate;
		this.rewardItem = quest.rewardItem;
		this.rewardStat = quest.rewardStat;

		FUNC.log("Copied Quest - (id : " + this.id + ", name : " + name + ")", FUNC.line());
	}

	if (!VAR.quests.has(this.id))
		VAR.quests.set(this.id, this);

	this.getMinLimitCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, FUNC.line());
		return this.minLimitCloseRate.get(temp);
	}
	this.getMaxLimitCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, FUNC.line());
		return this.maxLimitCloseRate.get(temp);
	}
	this.getMinLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.minLimitStat.get(temp);
	}
	this.getMaxLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.minLimitStat.get(temp);
	}
	this.getNeedItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, FUNC.line());
		return this.needItem.get(temp);
	}
	this.getNeedCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, FUNC.line());
		return this.needCloseRate.get(temp);
	}
	this.getNeedStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.minLimitStat.get(temp);
	}
	this.getRewardItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, FUNC.line());
		return this.rewardItem.get(temp);
	}
	this.getRewardStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.rewardStat.get(temp);
	}

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name, FUNC.line());
		if (temp !== null) this.name = temp;
	}
	this.setIsClearedOnce = function (isClearedOnce) {
		var temp = FUNC.checkType(Boolean, isClearedOnce, FUNC.line());
		if (temp !== null) this.isClearedOnce = temp;
	}
	this.setIsRepeatable = function (isRepeatable) {
		var temp = FUNC.checkType(Boolean, isRepeatable, FUNC.line());
		if (temp !== null) this.isRepeatable = temp;
	}
	this.setMinLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, FUNC.line(), 1, 999);
		if (temp !== null && temp <= this.maxLimitLv) this.minLimitLv = temp;
	}
	this.setMaxLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, FUNC.line(), 1, 999);
		if (temp !== null && temp >= this.minLimitLv) this.maxLimitLv = temp;
	}
	this.setNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line(), 0);
		if (temp !== null) this.needMoney = temp;
	}
	this.setNeedExp = function (exp) {
		var temp = FUNC.checkNaN(exp, FUNC.line(), 0);
		if (temp !== null) this.needExp = temp;
	}
	this.setNeedAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, FUNC.line(), 0);
		if (temp !== null) this.needAdv = temp;
	}
	this.setRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp, FUNC.line());
		if (temp !== null) this.rewardExp = temp;
	}
	this.setRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, FUNC.line());
		if (temp !== null) this.rewardAdv = temp;
	}
	this.setRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.rewardMoney = temp;
	}
	this.setMinLimitCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line(), 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.minLimitCloseRate.remove(temp1);
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
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line(), 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.maxLimitCloseRate.remove(temp1);
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
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.minLimitStat.remove(temp1);
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
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.maxLimitStat.remove(temp1);
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
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.needItem.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.needItem.set(temp1, temp2);
		}
	}
	this.setNeedCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line(), 0, 10000);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.needCloseRate.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.needCloseRate.set(temp1, temp2);
		}
	}
	this.setNeedStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.needStat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.needStat.set(temp1, temp2);
		}
	}
	this.setRewardItem = function (itemId, itemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardItem(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardItem.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.rewardItem.set(temp1, temp2);
		}
	}
	this.setRewardStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line(), 0);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);

			if (typeof value !== "undefined") {
				if (temp2 === 0) {
					this.rewardStat.remove(temp1);
					return;
				}

				if (temp2 > value || !ignore)
					return;
			}

			this.rewardStat.set(temp1, temp2);
		}
	}

	this.addMinLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, FUNC.line());

		if (temp !== null) {
			var value = this.minLimitLv + temp;
			if (value <= this.maxLimitLv) this.setMinLimitLv(value);
		}
	}
	this.addMaxLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv, FUNC.line());

		if (temp !== null) {
			var value = this.maxLimitLv + temp;
			if (value <= this.minLimitLv) this.setMinLimitLv(value);
		}
	}
	this.addNeedMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.setNeedMoney(this.needMoney + temp);
	}
	this.addNeedExp = function (exp) {
		var temp = FUNC.checkNaN(exp, FUNC.line());
		if (temp !== null) this.setNeedExp(this.needExp + temp);
	}
	this.addNeedAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, FUNC.line());
		if (temp !== null) this.setNeedAdv(this.needMoney + temp);
	}
	this.addRewardExp = function (exp) {
		var temp = FUNC.checkNaN(exp, FUNC.line());
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addRewardAdv = function (adv) {
		var temp = FUNC.checkNaN(adv, FUNC.line());
		if (temp !== null) this.setRewardAdv(this.rewardAdv + temp);
	}
	this.addRewardMoney = function (money) {
		var temp = FUNC.checkNaN(money, FUNC.line());
		if (temp !== null) this.setRewardMoney(this.rewardMoney + temp);
	}
	this.addMinLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitCloseRate Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitCloseRate Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMinLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitStat Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setMinLimitStat(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitStat Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitStat(temp1, value + temp2, true);
		}
	}
	this.addNeedItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addNeedItem Warning", FUNC.line, ENUM.LOG.warning);
				return;
			}

			this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addNeedStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addNeedStat Warning", FUNC.line(), ENUM.LOG.warning);
				return;
			}

			this.setNeedStat(temp1, value + temp2, true);
		}
	}
	this.addMinLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitCloseRate Warning", FUNC.line, ENUM.LOG.warning);
				return;
			}

			this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId, FUNC.line());
		var temp2 = FUNC.checkNaN(closeRate, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitCloseRate Warning", FUNC.line, ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, FUNC.line());
		var temp2 = FUNC.checkNaN(itemCount, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addRewardItem Warning", FUNC.line, ENUM.LOG.warning);
				return;
			}

			this.setRewardItem(temp1, value + temp2);
		}
	}
	this.addRewardStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum, FUNC.line());
		var temp2 = FUNC.checkNaN(stat, FUNC.line());

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addRewardStat Warning", FUNC.line, ENUM.LOG.warning);
				return;
			}

			this.setRewardStat(temp1, value + temp2);
		}
	}

	//TODO move to Player
	this.checkClear = function (playerId) {
		var temp = FUNC.checkNaN(playerId, FUNC.line());
		var player = VAR.players.get(temp);

		if (player.money < this.needMoney || player.getTotalExp() < this.needExp || player.adv < this.needAdv ||
			FUNC.check(this.needCloseRate, player.closeRate, ENUM.CHECKING.big, false) ||
			FUNC.check(this.needItem, player.inventory, ENUM.CHECKING.big, false))
			return false;

		if (this.isClearedOnce == false) {
			this.isClearedOnce = true;

			FUNC.reply(player, "\"" + this.name + "\" 퀘스트를 최초 클리어 하셨습니다",
				"이 메세지는 반복 퀘스트와 상관 없이 최초 클리어 시 발송됩니다");
		}

		return true;
	}
}

function Item(name, item) {
	if (typeof item === "undefined") {
		this.id = FUNC.getId(ENUM.ID.item);
		this.name = name;
		this.description = "";
		this.handleLevel = 1;
		this.value = -1;
		this.isWeapon = false;
		this.recipe = new Array();

		FUNC.log("Created New Item(id : " + id + ", name : " + name + ")", FUNC.line());
	}

	else {
		this.id = item.id;
		this.name = item.name;
		this.description = item.description;
		this.handleLevel = item.handleLevel;
		this.value = item.value;
		this.isWeapon = false;
		this.recipe = item.recipe;

		FUNC.log("Copied Item(id : " + id + ", name : " + name + ")", FUNC.line());
	}

	if (!VAR.items.has(this.id))
		VAR.items.set(this.id, this);

	this.setName = function (name) {
		var temp = FUNC.checkType(String, name, FUNC.line());
		if (temp !== null) this.name = temp;
	}
	this.setDescription = function (description) {
		var temp = FUNC.checkType(String, description, FUNC.line());
		if (temp !== null) this.description = temp;
	}
	this.setHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel, FUNC.line(), 1, 10);
		if (temp !== null) this.handleLevel = temp;
	}
	this.setValue = function (value) {
		var temp = FUNC.checkNaN(value, FUNC.line());
		if (temp !== null) this.value = temp;
	}

	this.addHandleLevel = function (handleLevel) {
		var temp = FUNC.checkNaN(handleLevel, FUNC.line());
		if (temp !== null) this.setHandleLevel(this.handleLevel + temp);
	}
	this.addValue = function (value) {
		var temp = FUNC.checkNaN(value, FUNC.line());
		if (temp !== null) this.setValue(this.value + temp);
	}
	this.addRecipe = function (recipe) {
		var temp = FUNC.checkType(Map, recipe, FUNC.line());
		if (temp !== null) this.recipe.push(temp);
	}
}

function Equipment(name, description, eTypeEnum, equipment) {
	if (typeof equipment !== "undefined") {
		this.id = FUNC.getId(ENUM.ID.equipment);
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
	}

	else {
		this.id = equipment.id;
		this.name = equipment.iname;
		this.description = equipment.description;
		this.eType = equipment.eType;
		this.value = -equipment.value;
		this.handleLevel = equipment.handleLevel;
		this.limitLv = equipment.limitLv;
		this.maxReinforce = equipment.maxReinforce;
		this.nowReinforce = equipment.nowReinforce;
		this.lvDown = equipment.lvDown;
		this.isWeapon = equipment.isWeapon;
		this.recipe = equipment.recipe;
		this.stat = equipment.stat;
		this.limitStat = equipment.limitStat;
		this.type = equipment.type;
		this.reinforce = equipment.reinforce;
	}

	if (!VAR.equipments.has(this.id))
		VAR.equipments.set(this.id, this);

	this.getFullName = function () {
		var str = "[";

		var c = this.handleLevel % 2 === 0 ? "★" : "☆";
		for (var i = 0; i < (this.handleLevel + 1) / 2; i++)
			str += c;

		str += "] \"" + this.name + " (+" + this.nowReinforce + ")";
		return str;
	}

	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.stat.get(temp);
	}
	this.getLimitStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.limitStat.get(temp);
	}
	this.getType = function (typeEnum) {
		var temp = FUNC.checkNaN(typeEnum, FUNC.line());
		return this.type.get(temp);
	}
	this.getReinforce = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum, FUNC.line());
		return this.reinforce.get(temp);
	}

	//TODO - Add Setter/Adder
}

function Player(nickName, name, image, room, player) {


	this.getFullName = function () {
		return "[" + this.nowTitle + "] " + this.nickName;
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
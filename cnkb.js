const scriptName = "cnkb.js";

const kalingModule = require("kaling.js").Kakao();
const Kakao = new kalingModule;
Kakao.init('0cbf070cc46c70fe11cfe7b90cd93874');
Kakao.login("", "");

const FUNC = {
	loadDB: function () {

	},

	saveDB: function () {

	},

	getDB: function (path) {

	},

	setDB: function (path, data) {

	},

	saveLog: function () {

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
		} catch (e) { } finally {
			VAR.log += " (" + String(e.rhinoException.getScriptStack()[1]) + ") - " + logData + "\n";
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

		return Number(variable);
	},

	getId: function (idType) {
		var value = VAR.id.get(idType);

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
		return String(func).substring(9).split("(")[0]
	},

	check: function (original, comparing, checking, ignore) {	//checking이 small이라면 compare이 original에 ��해 더 작을 때 true
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

	time: function () {
		return Date.now();
	},

	sleep: function (millis) {
		java.lang.Thread.sleep(millis);
	},

	formatImage: function (imageDB) {
		return Number(String(ImageDB.getProfildImage()).hashcode());
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
		"dra": 12,				//��수력
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
	}
};

const VAR = {
	"log": "",
	"players": new Map(),
	"chats": new Map(),
	"npcs": new Map(),
	"quests": new Map(),
	"items": new Map(),
	"achieves": new Map(),
	"researches": new Map(),
	"names": new Map(),
	"id": new Map(),
	"all": "\n\n" + ("\u200b".repeat(500)),
	"max": 999999999
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

function Chat(chat) {
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
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

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
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getItem(temp1) !== "undefined") {
				if (!ignore)
					return;
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
		if (temp !== null) this.text.push(temp);
	}
	this.addWait = function (waitEnum) {
		var temp = FUNC.checkNaN(waitEnum);

		if (temp !== null) {
			var length = this.wait.length;
			for (var i = 0; i < length; i++) {
				if (this.wait[i] === temp) {
					FUNC.log("addWait Warning", ENUM.LOG.warning);
					return;
				}
			}

			this.wait.push(temp);
		}
	}
	this.addStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setStat(temp1, value + temp2, true);
		}
	}
	this.addItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addItem Warning", ENUM.LOG.warning);
				return;
			}

			var result = value + temp2;
			result = result < 0 ? 0 : result;
			this.setItem(temp1, result, true);
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

		FUNC.log("Created New Npc - (id : " + this.id + ", name : " + name + ")");
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

		FUNC.log("Copied Chat - (id : " + this.id + ", name : " + name + ")");
	}

	VAR.npcs.set(this.id, this);

	this.getAvailableChat = function (playerId) {
		var output = new Array();
		var temp1 = FUNC.checkNaN(playerId, 1, VAR.players.size);

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
		var temp1 = FUNC.checkNaN(playerId, 1, VAR.players.size);
		var temp2 = FUNC.checkNaN(jobEnum);

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
								if (typeof value === "undefined") {
									if (value3[1] !== -1)
										output.set(value3[0], value3[1]);
									else
										output.set(value3[0], VAR.max);
								}

								else if (value < VAR.max)
									output.set(value3[0], value + value3[1]);
							}
						}
					}
				}
			}
		}

		return output;
	}

	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, 1, VAR.chats.size);

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
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp5 = FUNC.checkNaN(itemCount, -1, 999999999);

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
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getJob(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addJobLv Warning", ENUM.LOG.warning);
				return;
			}

			this.setJob(temp1, value + temp2, true);
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
			var value = this.getChat(temp1);

			if (typeof value !== "undefined") {
				FUNC.log("addChat Warning", ENUM.LOG.warning);
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
		var temp1 = FUNC.checkNaN(jobEnum);
		var temp2 = FUNC.checkNaN(jobLv, 1, 100);
		var temp3 = FUNC.checkNaN(minCloseRate, 1, 10000);
		var temp4 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp5 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null && temp3 !== null && temp4 !== null && temp5 !== null) {
			for (var i = 0; i < this.selling; i++) {
				if (this.selling[i].percent == -1) {
					FUNC.log("-1 percent already exists", ENUM.LOG.error);
					return;
				}
			}

			var value = this.getSelling(temp1, temp2, temp3, temp4);

			if (typeof value !== "undefined") {
				FUNC.log("addSelling Warning", ENUM.LOG.warning);
				return;
			}

			this.setSelling(temp1, temp2, temp3, temp4, temp5, true)
		}
	}
}

function Quest(name, quest) {
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
		this.targetNpc = 0;
		this.minLimitCloseRate = new Map();
		this.maxLimitCloseRate = new Map();
		this.minLimitStat = new Map();
		this.maxLimitStat = new Map();
		this.needItem = new Map();
		this.needStat = new Map();
		this.needCloseRate = new Map();
		this.rewardItem = new Map();
		this.rewardStat = new Map();
		this.rewardCloseRate = new Map();

		FUNC.log("Created New Quest - (id : " + this.id + ", name : " + name + ")");
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
		this.targetNpc = quest.targetNpc;
		this.minLimitCloseRate = quest.minLimitCloseRate;
		this.maxLimitCloseRate = quest.maxLimitCloseRate;
		this.minLimitStat = quest.minLimitStat;
		this.maxLimitStat = quest.minLimitStat;
		this.needItem = quest.needItem;
		this.needStat = quest.needStat
		this.needCloseRate = quest.needCloseRate;
		this.rewardItem = quest.rewardItem;
		this.rewardStat = quest.rewardStat;
		this.rewardCloseRate = quest.rewardCloseRate;

		FUNC.log("Copied Quest - (id : " + this.id + ", name : " + name + ")");
	}

	VAR.quests.set(this.id, this);

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
	this.getNeedCloseRate = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		return this.needCloseRate.get(temp);
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
	this.setTargetNpc = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		if (temp !== null) this.targetNpc = temp;
	}
	this.setMinLimitCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

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
		var temp1 = FUNC.checkNaN(npcId, 1);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

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
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

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
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

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
		var temp1 = FUNC.checkNaN(itemId, 1);
		var temp2 = FUNC.checkNaN(itemCount, 0);

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
		var temp1 = FUNC.checkNaN(npcId, 1);
		var temp2 = FUNC.checkNaN(closeRate, 0, 10000);

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
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getNeedStat(temp1) !== "undefined") {
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
		var temp1 = FUNC.checkNaN(itemId);
		var temp2 = FUNC.checkNaN(itemCount);

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
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardStat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.rewardStat.set(temp1, temp2);
		}
	}
	this.setRewardCloseRate = function (npcId, closeRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRewardCloseRate(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rewardCloseRate.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.rewardCloseRate.set(temp1, temp2);
		}
	}

	this.addMinLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv);

		if (temp !== null) {
			var value = this.minLimitLv + temp;
			if (value <= this.maxLimitLv) this.setMinLimitLv(value);
		}
	}
	this.addMaxLimitLv = function (lv) {
		var temp = FUNC.checkNaN(lv);

		if (temp !== null) {
			var value = this.maxLimitLv + temp;
			if (value <= this.minLimitLv) this.setMinLimitLv(value);
		}
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
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitCloseRate Warning", ENUM.LOG.warning);
				return;
			}

			this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitCloseRate Warning", ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMinLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setMinLimitStat(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitStat(temp1, value + temp2, true);
		}
	}
	this.addNeedItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addNeedItem Warning", ENUM.LOG.warning);
				return;
			}

			this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addNeedStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addNeedStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setNeedStat(temp1, value + temp2, true);
		}
	}
	this.addMinLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMinLimitCloseRate Warning", ENUM.LOG.warning);
				return;
			}

			this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addMaxLimitCloseRate Warning", ENUM.LOG.warning);
				return;
			}

			this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, itemCount) {
		var temp1 = FUNC.checkNaN(itemId);
		var temp2 = FUNC.checkNaN(itemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addRewardItem Warning", ENUM.LOG.warning);
				return;
			}

			this.setRewardItem(temp1, value + temp2);
		}
	}
	this.addRewardStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addRewardStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setRewardStat(temp1, value + temp2);
		}
	}
	this.addRewardCloseRate = function (npcId, closeRate) {
		var temp1 = FUNC.checkNaN(npcId);
		var temp2 = FUNC.checkNaN(closeRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardCloseRate(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addRewardCloseRate Warning", ENUM.LOG.warning);
				return;
			}

			this.setRewardCloseRate(temp1, value + temp2);
		}
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

		FUNC.log("Created New Item(id : " + id + ", name : " + name + ")");
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

		FUNC.log("Copied Item(id : " + id + ", name : " + name + ")");
	}

	VAR.items.set(this.id, this);

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
		if (temp !== null) this.recipe.push(temp);
	}
}

function Equipment(name, description, eTypeEnum, equipment) {
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

		FUNC.log("Created New Equipment(id : " + id + ", name : " + name + ")");
	}

	else {
		if (FUNC.checkType(Equipment, chat) === null) {
			FUNC.log("Equipment Copy Error", ENUM.LOG.error);
			return null;
		}

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

		FUNC.log("Copied Equipment(id : " + id + ", name : " + name + ")");
	}

	VAR.items.set(this.id, this);

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
					this.stat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
			}

			this.stat.set(temp1, temp2);
		}
	}
	this.setLimitStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.limitStat.remove(temp1);
					return;
				}

				if (!ignore)
					return;
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
					this.type.remove(temp1);
					return;
				}

				if (!ignore)
					return;
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
					this.reinforce.remove(temp1);
					return;
				}

				if (!ignore)
					return;
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
		if (temp !== null) this.recipe.push(temp);
	}
	this.addStat = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setStat(temp1, value + temp2, true);
		}
	}
	this.addLimit = function (stat2Enum, limitStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(limitStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitStat(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addLimitStat Warning", ENUM.LOG.warning);
				return;
			}

			this.setLimitStat(temp1, value + temp2, true);
		}
	}
	this.addType = function (typeEnum, type) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(type);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getType(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addType Warning", ENUM.LOG.warning);
				return;
			}

			this.setType(temp1, value + temp2, true);
		}
	}
	this.addReinforce = function (stat2Enum, stat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getReinforce(temp1);

			if (typeof value === "undefined") {
				FUNC.log("addReinforce Warning", ENUM.LOG.warning);
				return;
			}

			this.setReinforce(temp1, value + temp2, true);
		}
	}
}

function Player(nickName, name, imageDB, room, player) {
	if (typeof equipment !== "undefined") {
		this.id = FUNC.getId(ENUM.ID.player);
		this.nickName = nickName;
		this.name = name;
		this.image = FUNC.formatImage(imageDB);
		this.lastTime = FUNC.time();
		this.recentRoom = room;
		this.coord = new Coordinate();
		this.nowTitle = "";
		this.money = 1000;
		this.lv = 1;
		this.exp = 0;
		this.sp = 10;
		this.adv = 0;
		this.doing = ENUM.DOING.none;
		this.nowChat = 0;
		this.achieve = new Array();
		this.research = new Array();
		this.title = new Array();
		this.job = new Map();
		this.mainStat = new Map();
		this.resistStat = new Map();
		this.inventory = new Map();
		this.equipped = new Map();
		this.nowQuest = new Map();
		this.clearedQuest = new Map();
		this.closeRate = new Map();
		this.log = new Map();
		this.isClearedOnce = new Map();
		this.buff = new Map();
		this.debuff = new Map();
		this.type = new Map();

		FUNC.log("Created New Equipment(id : " + id + ", name : " + name + ")");
	}

	else {
		if (FUNC.checkType(Player, player) === null) {
			FUNC.log("Equipment Copy Error", ENUM.LOG.error);
			return null;
		}

		this.id = player.id;
		this.nickName = player.nickName;
		this.name = player.name;
		this.image = player.FUNC.formatImage(imageDB);
		this.lastTime = player.FUNC.time();
		this.recentRoom = player.room;
		this.coord = player.coord;
		this.nowTitle = player.ntle;
		this.money = player.money;
		this.lv = player.lv;
		this.exp = player.exp;
		this.sp = player.sp;
		this.adv = player.adv;
		this.doing = player.doing;
		this.nowChat = player.nowChat;
		this.achieve = player.achieve;
		this.research = player.research;
		this.title = player.title;
		this.job = player.job;
		this.mainStat = player.mainStat;
		this.resistStat = player.resistStat;
		this.inventory = player.inventory;
		this.equipped = player.equipped;
		this.nowQuest = player.nowQuest;
		this.clearedQuest = player.clearedQuest;
		this.closeRate = player.closeRate;
		this.log = player.log;
		this.isClearedOnce = player.isClearedOnce;
		this.buff = player.buff;
		this.debuff = player.debuff;
		this.type = player.type;

		FUNC.log("Copied Equipment(id : " + id + ", name : " + name + ")");
	}

	VAR.players.set(this.id, this);

	this.getFullName = function () {
		return "[" + this.nowTitle + "] " + this.nickName;
	}

	this.sendText = function (chatId, npcName) {
		this.doing = ENUM.DOING.chat;

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

		var value;
		var iterator = chat.item.entries();
		while (typeof (value = iterator.next().value) !== "undefined") {
			if (this.getInventory(value[0]) < (-1 * value[1])) {
				FUNC.reply(this.id, "보유 아이템이 부족하여 대화가 중지됩니다");
				return;
			}
		}

		if (chat.money * -1 > this.money) {
			FUNC.reply(this.id, "보유 금액이 부족하여 대화가 중지됩니다");
			return;
		}

		if (chat.quest != 0) {
			if (!this.canAddQuest(chat.quest)) {
				FUNC.reply(this.id, "퀘스트 추가가 불가능하여 대화가 중지됩니다");
				return;
			}

			this.addQuest(chat.quest);
			more += "퀘스트 추가 완료\n";
		}

		iterator = chat.stat.entries();
		while (typeof (value = iterator.next().value) !== "undefined") {
			if (this.getStat(value[0]) < (-1 * value[1])) {
				FUNC.reply(this.id, "스텟이 부족하여 대화가 중지됩니다");
				return;
			}
		}

		iterator = chat.item.entries();
		while (typeof (value = iterator.next().value) !== "undefined") {
			if (this.getInventory(value[0]) < (-1 * value[1])) {
				FUNC.reply(this.id, "아이템이 부족하여 대화가 중지됩니다");
				return;
			}
		}

		if (chat.money != 0) {
			this.addMoney(chat.money);
			more += "돈 추가 완료\n";
		}

		if (teleport !== null) {
			this.setCoord(chat.teleport.getX(), chat.teleport.getY());
			more += "순간이동 완료\n";
		}

		if (chat.stat.size > 0) {
			iterator = chat.stat.entires();
			while (typeof (value = iterator.next().value) !== "undefined")
				this.addStat(ENUM.STAT1.actStat, value[0], value[1]);

			more += "스텟 설정 완료\n";
		}

		if (chat.item.size > 0) {
			iterator = chat.item.entires();
			while (typeof (value = iterator.next().value) !== "undefined")
				this.addInventory(value[0], value[1]);

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
		this.sendText(chat.id, npc.name);
	}

	this.checkClear = function (questId) {
		var temp = FUNC.checkNaN(questId, 1, VAR.quests.size);

		if (temp === null) {
			FUNC.log("checkClear Error", VAR.npcs.size);
			return;
		}

		var quest = VAR.quests.get(temp);

		if (this.money < quest.needMoney || this.getTotalExp() < quest.needExp || this.adv < quest.needAdv ||
			FUNC.check(quest.needCloseRate, this.closeRate, ENUM.CHECKING.big, false) ||
			FUNC.check(quest.needItem, this.inventory, ENUM.CHECKING.big, false))
			return false;

		if (this.getIsClearedOnce(temp) === false) {
			this.setIsClearedOnce(temp, true);

			FUNC.reply(this.id, "\"" + quest.name + "\" 퀘스트를 최초(퀘스트 지급 후) 클리어 하셨습니다",
				"이 메세지는 반복 퀘스트와 상관 없이 최초 클리어 시 발송됩니다");
		}

		return true;
	}

	this.getJob = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getMainStat = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getResistStat = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getInventory = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getEqiupped = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getNowQuest = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getClearedQuest = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getCloseRate = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getLog = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getIsClearedOnce = function (jobEnum) {
		var temp = FUNC.checkNaN(jobEnum);
		return this.job.get(temp);
	}
	this.getBuff = function () {

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
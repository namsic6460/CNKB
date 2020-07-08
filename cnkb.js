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

}

function Chat(name, text, chat) {

}

function Npc(name, npc) {

}

function Quest(name, quest) {

}

function Item(id, name, description, item) {

}

function Equipment(typeId, name, description, eTypeEnum, item, equipment) {

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
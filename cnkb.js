const scriptName = "cnkb.js";

// const kalingModule = require("kaling.js").Kakao();
// const Kakao = new kalingModule;
// Kakao.init('0cbf070cc46c70fe11cfe7b90cd93874');
// Kakao.login("", "");

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
const BUILDINGPATH = FOLPATH + "buildings.json";
const SKILLPATH = FOLPATH + "skills.json";
const MONSTERPATH = FOLPATH + "monsters.json";
const VARPATH = FOLPATH + "vars.json";
const MAPPATH = FOLPATH + "map.json";
const LOGPATH = FOLPATH + "Log/";

const FUNC = {
	loadDB: function () {
		//채팅 데이터 파싱
		var chatDatas = JSON.parse(this.getDB(CHATPATH));
		if (chatDatas !== null) {
			var chat;

			for (var chatData of chatDatas) {
				chat = Chat.fromObject(chatData);
				this.saveInstance(ENUM.ID.chat, chat);
			}
		}

		//엔피시 데이터 파싱
		var npcDatas = JSON.parse(this.getDB(NPCPATH));
		if (npcDatas !== null) {
			var npc;

			for (var npcData of npcDatas) {
				npc = Npc.fromObject(npcData);
				this.saveInstance(ENUM.ID.npc, npc);
			}
		}

		//퀘스트 데이터 파싱
		var questDatas = JSON.parse(this.getDB(QUESTPATH));
		if (questDatas !== null) {
			var quest;

			for (var questData of questDatas) {
				quest = Quest.fromObject(questData);
				this.saveInstance(ENUM.ID.quest, quest);
			}
		}

		//아이템 데이터 파싱
		var itemDatas = JSON.parse(this.getDB(ITEMPATH));
		if (itemDatas !== null) {
			var item;

			for (var itemData of itemDatas) {
				item = Item.fromObject(itemData);
				if (item.isWeapon)
					item = Equipment.fromObject(itemData);

				this.saveInstance(ENUM.ID.item, item);
			}
		}

		//업적 데이터 파싱
		var achieveDatas = JSON.parse(this.getDB(ACHIEVEPATH));
		if (achieveDatas !== null) {
			var achieve;

			for (var achieveData of achieveDatas) {
				achieve = Achieve.fromObject(achieveData);
				this.saveInstance(ENUM.ID.achieve, achieve);
			}
		}


		//연구 데이터 파싱
		var researchDatas = JSON.parse(this.getDB(RESEARCHPATH));
		if (researchDatas !== null) {
			var research;

			for (var researchData of researchDatas) {
				research = Research.fromObject(researchData);
				this.saveInstance(ENUM.ID.research, research);
			}
		}

		//건물 데이터 파싱
		var buildingDatas = JSON.parse(this.getDB(BUILDINGPATH));
		if (buildingDatas !== null) {
			var building;

			for (var buildingData of buildingDatas) {
				building = Building.fromObject(buildingData);
				this.saveInstance(ENUM.ID.building, building);
			}
		}

		//스킬 데이터 파싱
		var skillDatas = JSON.parse(this.getDB(SKILLPATH));
		if (skillDatas !== null) {
			var skill;

			for (var skillData of skillDatas) {
				skill = Skill.fromObject(skillData);
				this.saveInstance(ENUM.ID.skill, skill);
			}
		}

		//몬스터 데이터 파싱
		var monsterDatas = JSON.parse(this.getDB(MONSTERPATH));
		if (monsterDatas !== null) {
			var monster;

			for (var monsterData of monsterDatas) {
				monster = Building.fromObject(monsterData);
				this.saveInstance(ENUM.ID.monster, monster);
			}
		}

		//플레이어 데이터 파싱
		var playerDatas = JSON.parse(this.getDB(PLAYERPATH));
		if (playerDatas !== null) {
			var player;

			for (var playerData of playerDatas) {
				player = Player.fromObject(playerData);
				this.saveInstance(ENUM.ID.player, player);
			}
		}

		//변수 데이터 파싱
		var varData = JSON.parse(this.getDB(VARPATH));
		if (varData !== null) {
			VAR.ddosTime = varData.ddosTime;
			VAR.rooms = varData.rooms;
			VAR.id = this.objToMap(varData.id);
			VAR.spGive = varData.spGive;
			VAR.expBoost = varData.expBoost;
		}

		//맵 데이터 파싱
		var x, y;
		var mapData = JSON.parse(this.getDB(MAPPATH));
		if (mapData !== null) {
			MAP.yLimit = Number(mapData.yLimit);
			MAP.xLimit = Number(mapData.xLimit);

			for (var yMap of mapData.mapData) {
				y = Number(yMap.y);
				MAP.map.set(y, new Map());

				for (xMap of yMap.value) {
					x = Number(xMap.x);
					MAP.map.get(y).set(x, new Map());
					MAP.map.get(y).get(x).set("name", String(xMap.name));
					MAP.map.get(y).get(x).set("npc", new Array(xMap.npc));
					MAP.map.get(y).get(x).set("building", new Array(xMap.building));
				}
			}
		}

		Api.makeNoti("Data Loaded", new Date(), 4);
	},

	saveDB: function () {
		//채팅 데이터 저장
		var chatDatas = new Array();
		var chatData;

		for (var chat of VAR.chats.values()) {
			chatData = Chat.toObject(chat);
			chatDatas.push(chatData);
		}
		this.setDB(CHATPATH, JSON.stringify(chatDatas, null, "\t"));

		//엔피시 데이터 저장
		var npcDatas = new Array();
		var npcData;

		for (var npc of VAR.npcs.values()) {
			npcData = Npc.toObject(npc);
			npcDatas.push(npcData);
		}
		this.setDB(NPCPATH, JSON.stringify(npcDatas, null, "\t"));

		//퀘스트 데이터 저장
		var questDatas = new Array();
		var questData;

		for (var quest of VAR.quests) {
			questData = Quest.toObject(quest);
			questDatas.push(questData);
		}
		this.setDB(QUESTPATH, JSON.stringify(questDatas, null, "\t"));

		//아이템 데이터 저장
		var itemDatas = new Array();
		var itemData;

		for (var item of VAR.items.values()) {
			if (!item.isWeapon)
				itemData = Item.toObject(item);
			else
				itemData = Equipment.toObject(item);

			itemDatas.push(itemData);
		}
		this.setDB(ITEMPATH, JSON.stringify(itemDatas, null, "\t"));

		//업적 데이터 저장
		var achieveDatas = new Array();
		var achieveData;

		for (var achieve of VAR.achieves.values()) {
			achieveData = Achieve.toObject(achieve);
			achieveDatas.push(achieveData);
		}
		this.setDB(ACHIEVEPATH, JSON.stringify(achieveDatas, null, "\t"));

		//연구 데이터 저장
		var researchDatas = new Array();
		var researchData;

		for (var research of VAR.researches.values()) {
			researchData = Research.toObject(research);
			researchDatas.push(researchData);
		}
		this.setDB(RESEARCHPATH, JSON.stringify(researchDatas, null, "\t"));

		//건물 데이터 저장
		var buildingDatas = new Array();
		var buildingData;

		for (var building of VAR.buildings.values()) {
			buildingData = Building.toObject(building);
			buildingDatas.push(buildingData);
		}
		this.setDB(BUILDINGPATH, JSON.stringify(buildingDatas, null, "\t"));

		//스킬 데이터 저장
		var skillDatas = new Array();
		var skillData;

		for (var skill of VAR.skills.values()) {
			skillData = Research.toObject(skill);
			skillDatas.push(skillData);
		}
		this.setDB(SKILLPATH, JSON.stringify(skillDatas, null, "\t"));

		//몬스터 데이터 저장
		var monsterDatas = new Array();
		var monsterData;

		for (var monster of VAR.monsters.values()) {
			monsterData = Research.toObject(monster);
			monsterDatas.push(monsterData);
		}
		this.setDB(MONSTERPATH, JSON.stringify(monsterDatas, null, "\t"));

		//플레이어 데이터 저장
		var playerDatas = new Array();
		var playerData;

		for (var player of VAR.players.values()) {
			playerData = Player.toObject(player);
			playerDatas.push(playerData);
		}
		this.setDB(PLAYERPATH, JSON.stringify(playerDatas, null, "\t"));

		//변수 데이터 저장
		var varData = new Object();
		varData.lastSaveTime = new Date().toString();
		varData.ddosTime = VAR.ddosTime;
		varData.rooms = VAR.rooms;
		varData.id = this.mapToObj(VAR.id);
		varData.spGive = VAR.spGive;
		varData.expBoost = VAR.expBoost;
		this.setDB(VARPATH, JSON.stringify(varData, null, "\t"));

		//맵 데이터 저장
		var obj1, obj2;
		var mapData = new Object();
		mapData.yLimit = MAP.yLimit;
		mapData.xLimit = MAP.xLimit;

		mapData.mapData = new Array();
		for (var [y, yMap] of MAP.map) {
			obj1 = new Object();
			obj1.y = y;
			obj1.value = new Array();

			for (var [x, xMap] of yMap) {
				obj2 = new Object();
				obj2.x = x;
				obj2.name = xMap.get("name");
				obj2.npc = xMap.get("npc");
				obj2.building = xMap.get("building");

				obj1.value.push(obj2);
			}

			mapData.mapData.push(obj1);
		}

		this.setDB(MAPPATH, JSON.stringify(mapData, null, "\t"));


		Api.makeNoti("Data Saved", new Date(), 3);
	},

	getDB: function (path) {
		return DB.getDataBase(path);
	},

	setDB: function (path, data) {
		DB.setDataBase(path, data);
	},

	saveLog: function () {
		FUNC.setDB(LOGPATH + String(this.time()) + ".txt", VAR.log);
	},

	findInstanceMap: function (idEnum) {
		switch (idEnum) {
			case ENUM.ID.achieve:
				return VAR.achieves;
			case ENUM.ID.building:
				return VAR.buildings;
			case ENUM.ID.chat:
				return VAR.chats;
			case ENUM.ID.item:
				return VAR.item;
			case ENUM.ID.monster:
				return VAR.monsters;
			case ENUM.ID.npc:
				return VAR.npcs;
			case ENUM.ID.player:
				return VAR.players;
			case ENUM.ID.quest:
				return VAR.quests;
			case ENUM.ID.research:
				return VAR.researches;
			case ENUM.ID.skill:
				return VAR.skills;
		}
	},

	saveInstance: function (idEnum, instance) {
		var map = this.findInstanceMap(idEnum);
		VAR.id.set(idEnum, map.size);
		map.set(instance.id, instance);
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

		if (logType == ENUM.LOG.error)
			Api.makeNoti("Error Occured!", new Date(), 5);

		VAR.logCount++;
		if (VAR.logCount >= 100) {
			this.saveLog();
			Api.makeNoti("Log Saved", new Date(), 2);
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
			this.log("NaN Error - (variable : " + variable + ", min : " + min + ", max : " + max + ")", ENUM.LOG.error);
			return null;
		}

		return Math.round(Number(variable));
	},

	getId: function (idEnum) {
		var value = VAR.id.get(idEnum);

		if (typeof value !== "undefined")
			return value;
		else
			return 1;
	},

	random: function (min, max) {
		var temp1 = this.checkNaN(min);
		var temp2 = this.checkNaN(max);

		if (temp1 !== null && temp2 !== null) {
			if (temp1 <= temp2)
				return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		return 0;
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
				str += VAR.all + more;

			Api.replyRoom(player.recentRoom, str.trim(), true);
		}
	},

	system: function (room, text, more) {
		var str = text;
		if (typeof more !== "undefined")
			str += VAR.all + more;
		Api.replyRoom(room, str.trim(), true);
	},

	systemAll: function (text, more) {
		var str = text;
		if (typeof more !== "undefined")
			str += VAR.all + more;

		var deleteList = new Array();
		for (var r of VAR.rooms) {
			if (!Api.replyRoom(r, str.trim(), true))
				deleteList.push(r);
		}

		for (var r of deleteList)
			this.removeValue(VAR.rooms, r);
	},

	time: function () {
		return Date.now();
	},

	sleep: function (millis) {
		Thread.sleep(millis);
	},

	formatImage: function (ImageDB) {
		return Number(java.lang.String(ImageDB.getProfileImage()).hashCode());
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

	compareCoord: function (coord1, coord2) {
		if (this.checkType(Coordinate, coord1) === null || this.checkType(Coordinate, coord2))
			return false;

		if (coord1.x === coord2.x && coord1.y === coord2.y)
			return true;
		return false;
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

	objToMap: function (obj) {
		var map = new Map();
		for (var element of obj)
			map.set(element.key, element.value);
		return map;
	},

	//실제 게임 구현부

	showCommands: function (room) {
		var str = "\"/\" 는 \"또는\"을 의미하고 \"{}\" 는 옵션을 의미하며\n명령어는 다음과 같습니다" + VAR.all +
			"(..가입/..회원가입) [닉네임] - 회원가입\n" +
			"(..명령어 / ..도움말 / ..help / ..h) - 명령어 목록 표시\n" +
			"(..내정보 / ..me / ..정보확인 / ..info / ..i) {닉네임} - 플레이어 정보 확인\n" +
			"(..이동 / ..move / ..m) [장소명] - 해당 장소까지의 최단 거리(육상 & 해상 & 안전육상 & 안전해상)\n" +
			"(..이동 / ..move / ..m) [장소명] ((해상 / sea / s) / (육상 / ground / g)) {안전 / safe / s} - 해당 장소로 이동\n" +
			"(..이동 / ..move / ..m) ((동 / east / e) / (서 / west / w) / (남 / south / s) / (북 / north / n)) - 선택한 방향으로 이동\n" +
			"(..행동 / ..do / ..d) - 해당 장소에서 할 수 있는 주요 행동 실행(ex - 광질/낚시/벌목 등)\n" +
			"(..사냥 / ..hunt / ..h) - <사냥지역> 사냥 시작\n" +
			"(..탐험 / ..explore / ..e) - <필드> 필드 탐험 시작\n" +
			"(..건물 / ..building / ..b) [건물명] - 입장 가능한 오브젝트가 있을 경우, 입장\n" +
			"(..지역 / ..region / ..r) - 현재 위치의 지역 정보를 표시\n" +
			"(..대화 / ..talk / ..t) [npc이름] - 현재 위치에 해당 엔피시가 있을 경우, 대화\n\n" +
			"--- 그 외 명령어들은 상황에 따라 표시됩니다 ---";

		Api.replyRoom(room, str, true);
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
		"magicMerchant": 1,		//마법 상인
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
		"max": 13
	},
	"WAIT_RESPONSE": {
		"nothing": 0,			//대답 없음
		"yes": 1,				//"예" 또는 "Y" 또는 "y" 또는 "ㅇ" 또는 "d"
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
	"FIELDTYPE": {
		"basic": 0,				//일반
		"mine": 1,				//광산
		"orchard": 2,			//과수원
		"flower": 3,			//꽃밭
		"pond": 4,				//연못
		"forest": 5,			//숲
		"mountain": 6,			//산
		"magma": 7,				//용암지대
		"sinkhole": 8,			//싱크홀지대
		"river": 9,				//강
		"sea": 10,				//바다
		"poison": 11,			//독 지대
		"ice": 12,				//빙산 지대
		"energy": 13,			//에너지 지대
		"dark": 14				//암흑 지대
	},
	"DAMAGETYPE": {
		"physical": 0,			//물리
		"magical": 1,			//마법
		"static": 2				//고정
	},
	"ID": {
		"player": 0,
		"chat": 1,
		"npc": 2,
		"quest": 3,
		"item": 4,
		"achieve": 5,
		"research": 6,
		"building": 7,
		"skill": 8,
		"monster": 9
	},
	"LOGNAME": {
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
	"buildings": new Map(),
	"skills": new Map(),
	"monsters": new Map(),
	"id": new Map(),
	"all": "\n(자세한 내용은 전체보기를 확인해주세요)\n--------------------\n" + ("\u200b".repeat(500)),
	"max": 999999999,
	"spGive": 5,
	"expBoost": 1
};

const MAP = {
	"xLimit": 10,
	"yLimit": 10,
	"map": new Map()
}

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
Coordinate.fromObject = function (coordData) {
	return new Coordinate(coordData.x, coordData.y);
}
Coordinate.toObject = function (coord) {
	var obj = new Object();
	obj.x = coord.x;
	obj.y = coord.y;
	return obj;
}

function Chat(chat) {
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
		var temp = FUNC.checkNaN(questId, 0, VAR.quests.size);
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
	this.setChat = function (response, chatId, isResponseEnum, ignore) {
		isResponseEnum = typeof isResponseEnum === "undefined" ? false : true;
		ignore = typeof ignore === "undefined" ? false : true;

		var temp1;
		if (!isResponseEnum)
			temp1 = FUNC.checkType(String, response);
		else
			temp1 = FUNC.checkNaN(response);

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
		var temp2 = FUNC.checkNaN(stat, 0);

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
		if (temp !== null) this.text.push(temp);
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

	//Constructor
	if (typeof chat === "undefined") {
		this.id = FUNC.getId(ENUM.id);
		this.pause = 1000;
		this.quest = 0;
		this.money = 0;
		this.teleport = null;
		this.text = new Array();
		this.wait = new Array();
		this.chat = new Map();
		this.stat = new Map();
		this.item = new Map();

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
}
Chat.toObject = function (chat) {
	var chatData = new Object();

	chatData.id = chat.id;
	chatData.pause = chat.pause;
	chatData.quest = chat.quest;
	chatData.money = chat.money;
	chatData.teleport = Coord.toObject(chat.teleport);
	chatData.text = chat.text;
	chatData.wait = chat.wait;
	chatData.chat = FUNC.mapToObj(chat.chat);
	chatData.stat = FUNC.mapToObj(chat.stat);
	chatData.item = FUNC.mapToObj(chat.item);

	return chatData;
}
Chat.fromObject = function (chatData) {
	var chat = new Chat();

	chat.id = Number(chatData.id);
	chat.pause = Number(chatData.pause);
	chat.quest = Number(chatData.quest);
	chat.money = Number(chatData.money);
	chat.teleport = Coord.fromObject(chatData.teleport);
	chat.text = new Array(chatData.text);
	chat.wait = new Array(chatData.wait);
	chat.chat = FUNC.objToMap(chatData.chat);
	chat.stat = FUNC.objToMap(chatData.stat);
	chat.item = FUNC.objToMap(chatData.item);

	return chat;
}

function Npc(name, npc) {
	this.getAvailableChat = function (playerId) {
		var percent = 0;
		var array = new Array();
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
					FUNC.check(c.get("maxQuest"), quest, ENUM.CHECKING.small, false, true)) {

					if (c.percent !== -1) {
						percent += c.percent;
						array.push(c.get("chat"));
					}

					else
						return [1, new Array(c.get("chat"))];
				}
			}
		}

		return [percent, array];
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

	//Constructor
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
}
Npc.toObject = function (npc) {
	var obj, obj1, obj2, obj3;
	var npcData = new Object();

	npcData.id = npc.id;
	npcData.name = npc.name;
	npcData.coord = Coord.toObject(npc.coord);
	npcData.job = FUNC.mapToObj(npc.job);

	npcData.chat = new Array();
	for (var chat of npc.chat) {
		obj = new Object();
		obj.chat = chat.get("chat");
		obj.percent = chat.get("percent");
		obj.minLv = chat.get("minLv");
		obj.minCloseRate = chat.get("minCloseRate");
		obj.minStat = FUNC.mapToObj(chat.get("minStat"));
		obj.minQuest = FUNC.mapToObj(chat.get("minQuest"));
		obj.maxLv = chat.get("maxLv");
		obj.maxCloseRate = chat.get("maxCloseRate");
		obj.maxStat = FUNC.mapToObj(chat.get("maxStat"));
		obj.maxQuest = FUNC.mapToObj(chat.get("maxQuest"));

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
				obj3.value = FUNC.mapToObj(itemMap);

				obj2.value.push(obj3);
			}

			obj1.value.push(obj1);
		}

		npcData.selling.push(obj1);
	}

	return npcData;
}
Npc.fromObject = function (npcData) {
	var map;
	var key1, key2, key3, key4;
	var value;
	var npc = new Npc(null);

	npc.id = Number(npcData.id);
	npc.name = String(npcData.name);
	npc.coord = Coord.fromObject(npcData.coord);
	npc.job = FUNC.objToMap(npcData.job);

	npc.chat = new Array();
	for (var chat of npcData.chat) {
		map = new Map();
		map.set("chat", Number(chat.chat));
		map.set("percent", Number(chat.percent));
		map.set("minLv", Number(chat.minLv));
		map.set("minCloseRate", Number(chat.minCloseRate));
		map.set("minStat", FUNC.objToMap(chat.minStat));
		map.set("minQuest", FUNC.objToMap(chat.minQuest));
		map.set("maxLv", Number(chat.maxLv));
		map.set("maxCloseRate", Number(chat.maxCloseRate));
		map.set("maxStat", FUNC.objToMap(chat.maxStat));
		map.set("maxQuest", FUNC.objToMap(chat.maxQuest));

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

	return npc;
}

function Quest(name, quest) {
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

	this.setIsRepeatable = function (isRepeatable) {
		var temp = FUNC.checkType(Boolean, isRepeatable);
		if (temp !== null) this.isRepeatable = temp;
	}
	this.setMinLimitLv = function (minLimitLv) {
		var temp = FUNC.checkNaN(minLimitLv, 1, this.maxLimitLv);
		if (temp !== null) this.minLimitLv = temp;
	}
	this.setMaxLimitLv = function (maxLimitLv) {
		var temp = FUNC.checkNaN(maxLimitLv, this.minLimitLv, 999);
		if (temp !== null && temp >= this.minLimitLv) this.maxLimitLv = temp;
	}
	this.setNeedMoney = function (needMoney) {
		var temp = FUNC.checkNaN(needMoney, 0);
		if (temp !== null) this.needMoney = temp;
	}
	this.setNeedExp = function (needExp) {
		var temp = FUNC.checkNaN(needExp, 0);
		if (temp !== null) this.needExp = temp;
	}
	this.setNeedAdv = function (needAdv) {
		var temp = FUNC.checkNaN(needAdv, 0);
		if (temp !== null) this.needAdv = temp;
	}
	this.setRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp);
		if (temp !== null) this.rewardExp = temp;
	}
	this.setRewardAdv = function (rewardAdv) {
		var temp = FUNC.checkNaN(rewardAdv);
		if (temp !== null) this.rewardAdv = temp;
	}
	this.setRewardMoney = function (rewardMoney) {
		var temp = FUNC.checkNaN(rewardMoney);
		if (temp !== null) this.rewardMoney = temp;
	}
	this.setMinLimitCloseRate = function (npcId, minLimitCloseRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(minLimitCloseRate, 0, 10000);

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
	this.setMaxLimitCloseRate = function (npcId, maxLimitCloseRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1);
		var temp2 = FUNC.checkNaN(maxLimitCloseRate, 0, 10000);

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
	this.setMinLimitStat = function (stat2Enum, minLimitStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(minLimitStat, 0);

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
	this.setMaxLimitStat = function (stat2Enum, maxLimitStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(maxLimitStat, 0);

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
	this.setNeedItem = function (itemId, needItemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1);
		var temp2 = FUNC.checkNaN(needItemCount, 0);

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
	this.setNeedStat = function (stat2Enum, needStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(needStat, 0);

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
	this.setRewardItem = function (itemId, rewardItemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardItemCount);

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
	this.setRewardStat = function (stat2Enum, rewardStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(rewardStat, 0);

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
	this.setRewardCloseRate = function (npcId, rewardCloseRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardCloseRate, 0);

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

	this.addMinLimitLv = function (minLimitLv) {
		var temp = FUNC.checkNaN(minLimitLv, 1, this.maxLimitLv);
		if (temp !== null) this.setMinLimitLv(value);
	}
	this.addMaxLimitLv = function (maxLimitLv) {
		var temp = FUNC.checkNaN(maxLimitLv, this.minLimitLv, 999);
		if (temp !== null) this.setMaxLimitLv(value);
	}
	this.addNeedMoney = function (needMoney) {
		var temp = FUNC.checkNaN(needMoney);
		if (temp !== null) this.setNeedMoney(this.needMoney + temp);
	}
	this.addNeedExp = function (needExp) {
		var temp = FUNC.checkNaN(needExp);
		if (temp !== null) this.setNeedExp(this.needExp + temp);
	}
	this.addNeedAdv = function (needAdv) {
		var temp = FUNC.checkNaN(needAdv);
		if (temp !== null) this.setNeedAdv(this.needMoney + temp);
	}
	this.addRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addRewardAdv = function (rewardAdv) {
		var temp = FUNC.checkNaN(rewardAdv);
		if (temp !== null) this.setRewardAdv(this.rewardAdv + temp);
	}
	this.addRewardMoney = function (rewardMoney) {
		var temp = FUNC.checkNaN(rewardMoney);
		if (temp !== null) this.setRewardMoney(this.rewardMoney + temp);
	}
	this.addMinLimitCloseRate = function (npcId, minLimitCloseRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(minLimitCloseRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitCloseRate(temp1);
			if (typeof value === "undefined")
				this.setMinLimitCloseRate(temp1, temp2, true);
			else
				this.setMinLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitCloseRate = function (npcId, maxLimitCloseRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(maxLimitCloseRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitCloseRate(temp1);
			if (typeof value === "undefined")
				this.setMaxLimitCloseRate(temp1, temp2, true);
			else
				this.setMaxLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addMinLimitStat = function (stat2Enum, minLimitStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(minLimitStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMinLimitStat(temp1);
			if (typeof value === "undefined")
				this.setMinLimitStat(temp1, temp2, true);
			else
				this.setMinLimitStat(temp1, value + temp2, true);
		}
	}
	this.addMaxLimitStat = function (stat2Enum, maxLimitStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(maxLimitStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getMaxLimitStat(temp1);
			if (typeof value === "undefined")
				this.setMaxLimitStat(temp1, temp2, true);
			else
				this.setMaxLimitStat(temp1, value + temp2, true);
		}
	}
	this.addNeedItem = function (itemId, needItemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(needItemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);
			if (typeof value === "undefined")
				this.setNeedItem(temp1, temp2, true);
			else
				this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addNeedStat = function (stat2Enum, needStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(needStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedStat(temp1);
			if (typeof value === "undefined")
				this.setNeedStat(temp1, temp2, true);
			else
				this.setNeedStat(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, rewardItemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardItemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);
			if (typeof value === "undefined")
				this.setRewardItem(temp1, temp2, true);
			else
				this.setRewardItem(temp1, value + temp2, true);
		}
	}
	this.addRewardStat = function (stat2Enum, rewardStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(rewardStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);
			if (typeof value === "undefined")
				this.setRewardStat(temp1, temp2, true);
			else
				this.setRewardStat(temp1, value + temp2, true);
		}
	}
	this.addRewardCloseRate = function (npcId, rewardCloseRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(rewardCloseRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardCloseRate(temp1);
			if (typeof value === "undefined")
				this.setRewardCloseRate(temp1, temp2, true);
			else
				this.setRewardCloseRate(temp1, value + temp2, true);
		}
	}

	//Constructor
	if (typeof quest === "undefined") {
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
		if (FUNC.checkType(Quest, quest) === null) {
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
}
Quest.toObject = function (quest) {
	var questData = new Object();

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

	return questData;
}
Quest.fromObject = function (questData) {
	var quest = new Quest(null);

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
	quest.minLimitCloseRate = FUNC.objToMap(questData.minLimitCloseRate);
	quest.maxLimitCloseRate = FUNC.objToMap(questData.maxLimitCloseRate);
	quest.minLimitStat = FUNC.objToMap(questData.minLimitStat);
	quest.maxLimitStat = FUNC.objToMap(questData.maxLimitStat);
	quest.needItem = FUNC.objToMap(questData.needItem);
	quest.needStat = FUNC.objToMap(questData.needStat);
	quest.rewardItem = FUNC.objToMap(questData.rewardItem);
	quest.rewardStat = FUNC.objToMap(questData.rewardStat);
	quest.rewardCloseRate = FUNC.objToMap(questData.rewardCloseRate);

	return quest;
}

function Item(name, item) {
	//[★★☆] "테스트 수정구슬""
	this.getFullName = function () {
		var str = "[";

		for (var i = 0; i < this.handleLevel / 2; i++)
			str += c;
		str += this.handleLevel % 2 === 0 ? "" : "☆";

		str += "] \"" + this.name + "\"";
		return str;
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
	this.setCanUse = function (canUse, executePart) {
		var temp1 = FUNC.checkType(Boolean, canUse);

		if (temp1 !== null) {
			this.canUse = temp1;

			if (temp1) {
				var temp2 = FUNC.checkType(String, executePart);

				this.executePart = temp2;
				this.use = new Function("user", temp2);
			}
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
	this.addRecipe = function (recipe) {
		var temp = FUNC.checkType(Map, recipe);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.recipe, temp) === "undefined")
				this.recipe.push(temp);
			else
				FUNC.log("addRecipe Error", ENUM.LOG.error);
		}
	}

	//Constructor
	if (typeof item === "undefined") {
		this.id = FUNC.getId(ENUM.ID.item);
		this.name = name;
		this.description = "";
		this.executePart;
		this.handleLevel = 1;
		this.value = -1;
		this.isWeapon = false;
		this.canUse = false;
		this.recipe = new Array();
		this.use;

		FUNC.log("Created New Item - (id : " + this.id + ", name : " + this.name + ")");
	}

	else {
		if (FUNC.checkType(Item, item) === null) {
			FUNC.log("Item Copy Error", ENUM.LOG.error);
			return null;
		}

		this.id = item.id;
		this.name = item.name;
		this.description = item.description;
		this.executePart;
		this.handleLevel = item.handleLevel;
		this.value = item.value;
		this.isWeapon = false;
		this.canUse = false;
		this.recipe = item.recipe;
		this.use;

		this.setCanUse(item.canUse, item.executePart);

		FUNC.log("Copied Item(id : " + this.id + ", name : " + this.name + ")");
	}
}
Item.toObject = function (item) {
	var obj;
	var itemData = new Object();

	itemData.id = item.id;
	itemData.name = item.name;
	itemData.description = item.description;
	itemData.executePart = item.executePart;
	itemData.handleLevel = item.handleLevel;
	itemData.value = item.value;
	itemData.isWeapon = item.isWeapon;
	itemData.canUse = item.canUse;

	itemData.recipe = new Array();
	for (var recipeMap of itemData.recipe) {
		for (var [itemId, itemCount] of recipeMap) {
			obj = new Object();
			obj.key = itemId;
			obj.value = itemCount;
			itemData.recipe.push(obj);
		}
	}

	return itemData;
}
Item.fromObject = function (itemData) {
	var map;
	var key;
	var value;
	var item = new Item(null);

	item.id = Number(itemData.id);
	item.name = String(itemData.name);
	item.description = String(itemData.description);
	item.handleLevel = Number(itemData.handleLevel);
	item.value = Number(itemData.value);
	item.isWeapon = Boolean(itemData.isWeapon);
	item.setCanUse(Boolean(itemData.canUse), String(itemData.executePart));

	item.recipe = new Array();
	for (var recipeMap of itemData.recipe) {
		key = Number(recipeMap.key);
		value = Number(recipeMap.value);

		map = new Map();
		map.set(key, value);

		item.recipe.push(map);
	}

	return item;
}

function Equipment(name, description, eTypeEnum, equipment) {
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
	this.setLimitStat = function (stat2Enum, limitStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(limitStat, 0);

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
	this.setType = function (typeEnum, typeLv) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(typeLv, 0, 5);

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
	this.addLimitStat = function (stat2Enum, limitStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(limitStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitStat(temp1);
			if (typeof value === "undefined")
				this.setLimitStat(temp1, temp2, true);
			else
				this.setLimitStat(temp1, value + temp2, true);
		}
	}
	this.addType = function (typeEnum, typeLv) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(typeLv);

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

	//Constructor
	if (typeof equipment === "undefined") {
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

		FUNC.log("Created New Equipment - (id : " + this.id + ", name : " + this.name + ")");
	}

	else {
		if (FUNC.checkType(Equipment, equipment) === null) {
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
		this.isWeapon = true;
		this.recipe = equipment.recipe;
		this.stat = equipment.stat;
		this.limitStat = equipment.limitStat;
		this.type = equipment.type;
		this.reinforce = equipment.reinforce;

		FUNC.log("Copied Equipment(id : " + this.id + ", name : " + this.name + ")");
	}
}
Equipment.toObject = function (equipment) {
	var obj;
	var equipmentData = new Object();

	equipmentData.id = equipment.id;
	equipmentData.name = equipment.name;
	equipmentData.description = equipment.description;
	equipmentData.handleLevel = equipment.handleLevel;
	equipmentData.value = equipment.value;
	equipmentData.isWeapon = equipment.isWeapon;

	equipmentData.recipe = new Array();
	for (var recipeMap of equipmentData.recipe) {
		for (var [itemId, itemCount] of recipeMap) {
			obj = new Object();
			obj.key = itemId;
			obj.value = itemCount;
			equipmentData.recipe.push(obj);
		}
	}

	equipmentData.eType = equipment.eType;
	equipmentData.limitLv = equipment.limitLv;
	equipmentData.maxReinforce = equipment.maxReinforce;
	equipmentData.nowReinforce = equipment.nowReinforce;
	equipmentData.lvDown = equipment.lvDown;
	equipmentData.stat = FUNC.mapToObj(equipment.stat);
	equipmentData.limitStat = FUNC.mapToObj(equipment.limitStat);
	equipmentData.type = FUNC.mapToObj(equipment.type);
	equipmentData.reinforce = FUNC.mapToObj(equipment.reinforce);

	return equipmentData;
}
Equipment.fromObject = function (equipmentData) {
	var map;
	var key;
	var value;
	var equipment = new Equipment(null, null, null);

	equipment.id = Number(equipmentData.id);
	equipment.name = String(equipmentData.name);
	equipment.description = String(equipmentData.description);
	equipment.handleLevel = Number(equipmentData.handleLevel);
	equipment.value = Number(equipmentData.value);
	equipment.isWeapon = true;

	equipment.recipe = new Array();
	for (var recipeMap of equipmentData.recipe) {
		key = Number(recipeMap.key);
		value = Number(recipeMap.value);

		map = new Map();
		map.set(key, value);

		equipment.recipe.push(map);
	}

	equipment.eType = Number(equipmentData.eType);
	equipment.limitLv = Number(equipmentData.limitLv);
	equipment.maxReinforce = Number(equipmentData.maxReinforce);
	equipment.nowReinforce = Number(equipmentData.nowReinforce);
	equipment.lvDown = Number(equipmentData.lvDown);
	equipment.stat = FUNC.objToMap(equipmentData.stat);
	equipment.limitStat = FUNC.objToMap(equipmentData.limitStat);
	equipment.type = FUNC.objToMap(equipmentData.type);
	equipment.reinforce = FUNC.objToMap(equipmentData.reinforce);

	return equipment;
}

function Achieve(name, achieve) {
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

	this.setLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv, 1, 999);
		if (temp !== null) this.limitLv = temp;
	}
	this.setRewardMoney = function (rewardMoney) {
		var temp = FUNC.checkNaN(rewardMoney, 0);
		if (temp !== null) this.money = temp;
	}
	this.setRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp, 0);
		if (temp !== null) this.rewardExp = exp;
	}
	this.setRewardAdv = function (rewardAdv) {
		var temp = FUNC.checkNaN(rewardAdv);
		if (temp !== null) this.rewardAdv = temp;
	}
	this.setLimitStat = function (stat2Enum, limitStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(limitStat, 0);

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
	this.setLimitCloseRate = function (npcId, limitCloseRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(limitCloseRate, 0, 10000);

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
	this.setOtherLimit = function (logNameEnum, logData, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(logNameEnum);
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
	this.setRewardCloseRate = function (npcId, rewardCloseRate, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardCloseRate, 0);

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
	this.setRewardItem = function (itemId, rewardItemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardItemCount, 1);

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
	this.addRewardMoney = function (rewardMoney) {
		var temp = FUNC.checkNaN(rewardMoney);
		if (temp !== null) this.setRewardMoney(this.rewardMoney + temp);
	}
	this.addRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addRewardAdv = function (rewardAdv) {
		var temp = FUNC.checkNaN(rewardAdv);
		if (temp !== null) this.setRewardAdv(this.rewardAdv + temp);
	}
	this.addLimitStat = function (stat2Enum, limitStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(limitStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitStat(temp1);
			if (typeof value === "undefined")
				this.setLimitStat(temp1, temp2, true);
			else
				this.setLimitStat(temp1, value + temp2, true);
		}
	}
	this.addLimitCloseRate = function (npcId, limitCloseRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(limitCloseRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLimitCloseRate(temp1);
			if (typeof value === "undefined")
				this.setLimitCloseRate(temp1, temp2, true);
			else
				this.setLimitCloseRate(temp1, value + temp2, true);
		}
	}
	this.addOtherLimit = function (logNameEnum, logData) {
		var temp1 = FUNC.checkNaN(logNameEnum);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getOtherLimit(temp1);
			if (typeof value === "undefined")
				this.setOtherLimit(temp1, temp2, true);
			else
				this.setOtherLimit(temp1, value + temp2, true);
		}
	}
	this.addRewardCloseRate = function (npcId, rewardCloseRate) {
		var temp1 = FUNC.checkNaN(npcId, 1, VAR.npcs.size);
		var temp2 = FUNC.checkNaN(rewardCloseRate);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardCloseRate(temp1);
			if (typeof value === "undefined")
				this.setRewardCloseRate(temp1, temp2, true);
			else
				this.setRewardCloseRate(temp1, value + temp2, true);
		}
	}
	this.addRewardItem = function (itemId, rewardItemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(rewardItemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardItem(temp1);
			if (typeof value === "undefined")
				this.setRewardItem(temp1, temp2, true);
			else
				this.setRewardItem(temp1, value + temp2, true);
		}
	}

	//Constructor
	if (typeof achieve === "undefined") {
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

		FUNC.log("Created New Achieve - (id : " + this.id + ", name : " + this.name + ")");
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
}
Achieve.toObject = function (achieve) {
	var achieveData = new Object();

	achieveData.id = achieve.id;
	achieveData.name = achieve.name;
	achieveData.limitLv = achieve.limitLv;
	achieveData.rewardMoney = achieve.rewardMoney;
	achieveData.rewardExp = achieve.rewardExp;
	achieveData.rewardAdv = achieve.rewardAdv;
	achieveData.limitStat = FUNC.mapToObj(achieve.limitStat);
	achieveData.limitCloseRate = FUNC.mapToObj(achieve.limitCloseRate);
	achieveData.otherLimit = FUNC.mapToObj(achieve.otherLimit);
	achieveData.rewardCloseRate = FUNC.mapToObj(achieve.rewardCloseRate);
	achieveData.rewardItem = FUNC.mapToObj(achieve.rewardItem);

	return achieveData;
}
Achieve.fromObject = function (achieveData) {
	var achieve = new Achieve(null);

	achieve.id = Number(achieveData.id);
	achieve.name = String(achieveData.name);
	achieve.limitLv = Number(achieveData.limitLv);
	achieve.rewardMoney = Number(achieveData.rewardMoney);
	achieve.rewardExp = Number(achieveData.rewardExp);
	achieve.rewardAdv = Number(achieveData.rewardAdv);
	achieve.limitStat = FUNC.objToMap(achieveData.limitStat);
	achieve.limitCloseRate = FUNC.objToMap(achieveData.limitCloseRate);
	achieve.otherLimit = FUNC.objToMap(achieveData.otherLimit);
	achieve.rewardCloseRate = FUNC.objToMap(achieveData.rewardCloseRate);
	achieve.rewardItem = FUNC.objToMap(achieveData.rewardItem);

	return achieve;
}

function Research(name, research) {
	this.getNeedItem = function (itemId) {
		var temp = FUNC.checkNaN(itemId, 1, VAR.items.size);
		return this.needItem.get(temp);
	}
	this.getRewardStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.rewardStat.get(temp);
	}

	this.setNeedMoney = function (needMoney) {
		var temp = FUNC.checkNaN(needMoney, 0);
		if (temp !== null) this.money = temp;
	}
	this.setLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv, 1, 999);
		if (temp !== null) this.limitLv = temp;
	}
	this.setRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp, 0);
		if (temp !== null) this.rewardExp = exp;
	}
	this.setNeedItem = function (itemId, needItemCount, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(itemId, 1);
		var temp2 = FUNC.checkNaN(needItemCount, 0);

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
	this.setRewardStat = function (stat2Enum, rewardStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(rewardStat, 0);

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

	this.addNeedMoney = function (needMoney) {
		var temp = FUNC.checkNaN(needMoney);
		if (temp !== null) this.setNeedMoney(this.needMoney + temp);
	}
	this.addLimitLv = function (limitLv) {
		var temp = FUNC.checkNaN(limitLv);
		if (temp !== null) this.setLimitLv(this.limitLv + temp);
	}
	this.addRewardExp = function (rewardExp) {
		var temp = FUNC.checkNaN(rewardExp);
		if (temp !== null) this.setRewardExp(this.rewardExp + temp);
	}
	this.addNeedItem = function (itemId, needItemCount) {
		var temp1 = FUNC.checkNaN(itemId, 1, VAR.items.size);
		var temp2 = FUNC.checkNaN(needItemCount);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getNeedItem(temp1);
			if (typeof value === "undefined")
				this.setNeedItem(temp1, temp2, true);
			else
				this.setNeedItem(temp1, value + temp2, true);
		}
	}
	this.addRewardStat = function (stat2Enum, rewardStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(rewardStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRewardStat(temp1);
			if (typeof value === "undefined")
				this.setRewardStat(temp1, temp2, true);
			else
				this.setRewardStat(temp1, value + temp2, true);
		}
	}

	//Constructor
	if (typeof research === "undefined") {
		this.id = FUNC.getId(ENUM.ID.research);
		this.name = name;
		this.needMoney = 0;
		this.limitLv = 999;
		this.rewardExp = 0;
		this.needItem = new Map();
		this.limitStat = new Map();

		FUNC.log("Created New Research - (id : " + this.id + ", name : " + this.name + ")");
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
}
Research.toObject = function (research) {
	var researchData = new Object();

	researchData.id = research.id;
	researchData.name = research.name;
	researchData.needMoney = research.needMoney;
	researchData.limitLv = research.limitLv;
	researchData.rewardExp = research.rewardExp;
	researchData.needItem = FUNC.mapToObj(research.needItem);
	researchData.rewardItem = FUNC.mapToObj(research.rewardStat);

	return researchData;
}
Research.fromObject = function (researchData) {
	var research = new Research(null);

	research.id = Number(researchData.id);
	research.name = String(researchData.name);
	research.needMoney = Number(researchData.needMoney);
	research.limitLv = Number(researchData.limitLv);
	research.rewardExp = Number(researchData.rewardExp);
	research.needItem = FUNC.objToMap(researchData.needItem);
	research.rewardItem = FUNC.objToMap(researchData.rewardStat);

	return research;
}

function Building(name, building) {
	this.getAvailableMonster = function () {
		var percent = 0;
		var map = new Map();

		for (var monster of VAR.monsters) {
			if (monster.minDifficulty > this.difficulty || monster.maxDifficulty < this.difficulty)
				continue;

			if (typeof FUNC.findValue(this.fieldType, monster.mainField) !== "undefined") {
				percent += 2;
				map.set(monser.id, 2);
			}

			else {
				for (var field of monster.subField) {
					if (typeof FUNC.findValue(this.fieldType, field) !== "undefined") {
						percent += 1;
						map.set(monster.id, 1);
					}
				}
			}
		}

		return [percent, map];
	}
	this.randomMonster = function () {
		var monsters = this.getAvailableMonster();
		var totalPercent = monsters[0];
		var random = FUNC.random(1, totalPercent);

		var value = 0;
		for (var [monsterId, percent] of monsters[1]) {
			value += percent;

			if (value <= random)
				return monsterId;
		}
	}

	this.setDifficulty = function (difficulty) {
		var temp = FUNC.checkNaN(difficulty, 0, 999);
		if (temp !== null) this.difficulty = temp;
	}

	this.addDifficulty = function (difficulty) {
		var temp = FUNC.checkNaN(difficulty);
		if (temp !== null) this.setDifficulty(this.difficulty + temp);
	}
	this.addNpc = function (npcId) {
		var temp = FUNC.checkNaN(npcId, 1, VAR.npcs.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.npc, temp) === "undefined")
				this.npc.push(temp);
			else
				FUNC.log("addNpc Error", ENUM.LOG.error);
		}
	}
	this.addUniqueMonster = function (monsterId) {
		var temp = FUNC.checkNaN(monsterId, 1, VAR.monsters.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.uniqueMonster, temp) === "undefined")
				this.uniqueMonster.push(temp);
			else
				FUNC.log("addUniqueMonster Error", ENUM.LOG.error);
		}
	}
	this.addMove = function (buildingId) {
		var temp = FUNC.checkNaN(buildingId, 1, VAR.buildings.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.building, temp) === "undefined")
				this.building.push(temp);
			else
				FUNC.log("addMove Error", ENUM.LOG.error);
		}
	}
	this.addFieldType = function (fieldTypeEnum) {
		var temp = FUNC.checkNaN(fieldTypeEnum);

		if (temp !== null) {
			if (this.difficulty !== 0 && typeof FUNC.findValue(this.fieldType, temp) === "undefined")
				this.building.push(temp);
			else
				FUNC.log("addFieldType Error", ENUM.LOG.error);
		}
	}

	//Constructor
	if (typeof building === "undefined") {
		this.id = FUNC.getId(ENUM.ID.building);
		this.name = name;
		this.difficulty = 0;
		this.npc = new Array();
		this.uniqueMonster = new Array();
		this.move = new Array();
		this.fieldType = new Array();

		FUNC.log("Created New Building - (id : " + this.id + ", name : " + this.name + ")");
	}

	else {
		if (FUNC.checkType(Building, building) === null) {
			FUNC.log("Building Copy Error", ENUM.LOG.error);
			return null;
		}

		this.id = building.id;
		this.name = building.name;
		this.difficulty = building.difficulty;
		this.npc = building.npc;
		this.uniqueMonster = building.uniqueMonster;
		this.move = building.move;
		this.fieldType = building.fieldType;

		FUNC.log("Copied Building(id : " + this.id + ", name : " + this.name + ")");
	}
}
Building.toObject = function (building) {
	var buildingData = new Object();

	buildingData.id = building.id;
	buildingData.name = building.name;
	buildingData.difficulty = building.difficulty;
	buildingData.npc = building.npc;
	buildingData.uniqueMonster = building.uniqueMonster;
	buildingData.move = building.move;
	buildingData.fieldType = building.fieldType;

	return buildingData;
}
Building.fromObject = function (buildingData) {
	var building = new Building(null);

	building.id = Number(buildingData.id);
	building.name = String(buildingData.name);
	building.difficulty = Number(buildingData.difficulty);
	building.npc = new Array(buildingData.npc);
	building.uniqueMonster = new Array(buildingData.uniqueMonster);
	building.move = new Array(buildingData.move);
	building.fieldType = new Array(buildingData.fieldType);

	return building;
}

function Skill(name, skill) {
	this.getDamageType = function (damageType) {
		var temp = FUNC.checkNaN(damageType);
		return this.damageType.get(temp);
	}

	this.setIsPassive = function (isPassive) {
		var temp = FUNC.checkType(Boolean, isPassive);
		if (temp !== null) this.isPassive = temp;
	}
	this.setDamageType = function (damageTypeMap) {
		var temp = FUNC.checkType(damageTypeMap, Map);

		if (temp !== null) {
			if (temp.size > 0) {
				var percent = 0;

				for (var p of temp.values())
					percent += p;

				if (percent !== 100)
					return;
			}

			this.damageType = damageTypeMap;
		}
	}
	this.setUse = function (executePart) {
		var temp = FUNC.checkType(String, executePart);

		if (temp !== null) {
			this.executePart = temp2;
			this.use = new Function("user", "target", "isUserPlayer", temp);
		}
	}

	//Constructor
	if (typeof skill === "undefined") {
		this.id = FUNC.getId(ENUM.ID.skill);
		this.name = name;
		this.executePart;
		this.limitLv = 1;
		this.isPassive = false;
		this.damageType = new Map();
		this.limitStat = new Map();
		this.use;

		this.setUse("return true;");

		FUNC.log("Created New Skill - (id : " + this.id + ", name : " + this.name + ")");
	}

	else {
		if (FUNC.checkType(Skill, skill) === null) {
			FUNC.log("Skill Copy Error", ENUM.LOG.error);
			return null;
		}

		this.id = skill.id;
		this.name = skill.name;
		this.executePart = skill.executePart;
		this.limitLv = skill.limitLv;
		this.isPassive = skill.isPassive;
		this.damageType = skill.damageType;
		this.limitStat = skill.limitStat;
		this.use = skill.use;

		FUNC.log("Copied Skill(id : " + this.id + ", name : " + this.name + ")");
	}
}
Skill.toObject = function (skill) {
	var skillData = new Object();

	skillData.id = skill.id;
	skillData.name = skill.name;
	skillData.executePart = skill.executePart;
	skillData.limitLv = skill.limitLv;
	skillData.isPassive = skill.isPassive;
	skillData.damageType = FUNC.mapToObj(skill.damageType);
	skillData.limitStat = FUNC.mapToObj(skill.limitStat);

	return skillData;
}
Skill.fromObject = function (skillData) {
	var skill = new Skill(null);

	skill.id = Number(skillData.id);
	skill.name = String(skillData.name);
	skill.setUse(String(skillData.executePart));
	skill.limitLv = Number(skillData.limitLv);
	skill.isPassive = Boolean(skillData.isPassive);
	skill.damageType = FUNC.objToMap(skillData.damageType);
	skill.limitStat = FUNC.objToMap(skillData.limitStat);

	return skill;
}

function Monster(name, monster) {
	this.getPhaseStartSkill = function (phase) {
		var temp = FUNC.checkNaN(phase, 0);
		return this.phaseStartSkill.get(temp);
	}
	this.getStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.stat.get(temp);
	}
	this.getRareIncreaseStat = function (stat2Enum) {
		var temp = FUNC.checkNaN(stat2Enum);
		return this.rareIncreaseStat.get(temp);
	}
	this.getPhaseSkill = function (phase) {
		var temp = FUNC.checkNaN(phase, 0);
		return this.phaseSkill.get(temp);
	}
	this.getPhaseIncreaseStat = function (phase, stat2Enum) {
		var temp1 = FUNC.checkNaN(phase, 0);
		var temp2 = FUNC.checkNaN(stat2Enum);

		if (temp1 !== null && temp2 !== null && this.phaseIncreaseStat.has(temp1))
			return this.phaseIncreaseStat.get(temp1).get(temp2);
		return undefined;
	}

	this.setRarePercent = function (rarePercent) {
		var temp = FUNC.checkNaN(rarePercent, 0, 10000);
		if (temp !== null) this.rarePercent = temp;
	}
	this.setMinDifficulty = function (minDifficulty) {
		var temp = FUNC.checkNaN(minDifficulty, 1, this.maxDifficulty);
		if (temp !== null) this.minDifficulty = temp;
	}
	this.setMaxDifficulty = function (maxDifficulty) {
		var temp = FUNC.checkNaN(maxDifficulty, this.minDifficulty, 999);
		if (temp !== null) this.maxDifficulty = temp;
	}
	this.setMainField = function (fieldTypeEnum) {
		var temp = FUNC.checkNaN(fieldTypeEnum);
		if (temp !== null) this.mainField = temp;
	}
	this.setPhaseStartSkill = function (phase, skillId, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(phase, 0);
		var temp2 = FUNC.checkNaN(skillId, 1, VAR.skills.size);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getPhaseStartSkill(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.phaseStartSkill.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setPhaseStartSkill Error", ENUM.LOG.error);
					return;
				}
			}

			this.phaseStartSkill.set(temp1, temp2);
		}
	}
	this.setStat = function (stat2Enum, stat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(stat, 0);

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
	this.setRareIncreaseStat = function (stat2Enum, increaseStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(increaseStat, 0);

		if (temp1 !== null && temp2 !== null) {
			if (typeof this.getRareIncreaseStat(temp1) !== "undefined") {
				if (temp2 === 0) {
					this.rareIncreaseStat.delete(temp1);
					return;
				}

				if (!ignore) {
					FUNC.log("setRareIncreaseStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.rareIncreaseStat.set(temp1, temp2);
		}
	}
	this.setPhaseIncreaseStat = function (phase, stat2Enum, increaseStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(phase, 0);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(increaseStat, 0);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			if (typeof this.getPhaseIncreaseStat(temp1, temp2) !== "undefined") {
				if (temp3 === 0) {
					this.phaseIncreaseStat.get(temp1).delete(temp2);
					return;
				}

				if (!ignore) {
					FUNC.log("setPhaseIncreaseStat Error", ENUM.LOG.error);
					return;
				}
			}

			this.phaseIncreaseStat.get(temp1).set(temp2, temp3);
		}
	}
	this.addRarePercent = function (rarePercent) {
		var temp = FUNC.checkNaN(rarePercent);
		if (temp !== null) this.setRarePercent(this.rarePercent + temp);
	}
	this.addMinDifficulty = function (minDifficulty) {
		var temp = FUNC.checkNaN(minDifficulty);
		if (temp !== null) this.setMinDifficulty(this.minDifficulty + temp);
	}
	this.addMaxDifficulty = function (maxDifficulty) {
		var temp = FUNC.checkNaN(maxDifficulty);
		if (temp !== null) this.setMaxDifficulty(this.maxDifficulty + temp);
	}
	this.addPhaseHealth = function (phaseHealth) {
		var temp = FUNC.checkNaN(phaseHealth, 1, 100);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.phaseHealth, temp) === "undefined") {
				this.phaseHealth.push(temp);
				this.phaseSkill.set(temp, new Array());
				this.phaseIncreaseStat.set(temp, new Map());
			}

			else
				FUNC.log("addPhaseHealth Error", ENUM.LOG.error);
		}
	}
	this.addSkill = function (skillId) {
		var temp = FUNC.checkNaN(skillId, 1, VAR.skills.size);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.skill, temp) === "undefined")
				this.skill.push(temp);
			else
				FUNC.log("addSkill Error", ENUM.LOG.error);
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
	this.addRareIncreaseStat = function (stat2Enum, increaseStat) {
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(increaseStat);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getRareIncreaseStat(temp1);
			if (typeof value === "undefined")
				this.setRareIncreaseStat(temp1, temp2, true);
			else
				this.setRareIncreaseStat(temp1, value + temp2, true);
		}
	}
	this.addPhaseSkill = function (phase, skillId) {
		var temp1 = FUNC.checkNaN(phase, 0);
		var temp2 = FUNC.checkNaN(skillId, 1, VAR.skills.size);

		if (temp1 !== null && temp2 !== null) {
			if (typeof FUNC.findValue(this.phaseSkill.get(temp1)) === "undefined")
				this.phaseSkill.get(temp1).push(temp2);
			else
				FUNC.log("addPhaseSkill Error", ENUM.LOG.error);
		}
	}
	this.addPhaseIncreaseStat = function (phase, stat2Enum, increaseStat) {
		var temp1 = FUNC.checkNaN(phase, 0);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(increaseStat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getPhaseIncreaseStat(temp1, temp2);
			if (typeof value === "undefined")
				this.setPhaseIncreaseStat(temp1, temp2, temp3, true);
			else
				this.setPhaseIncreaseStat(temp1, temp2, value + temp3, true);
		}
	}

	//Constructor
	if (typeof monster === "undefined") {
		this.id = FUNC.getId(ENUM.ID.monster);
		this.name = name;
		this.rarePercent = 0;
		this.minDifficulty = 1;
		this.maxDifficulty = 999;
		this.mainField = ENUM.FIELDTYPE.basic;
		this.subField = new Array();
		this.phaseHealth = new Array();
		this.skill = new Array();
		this.phaseStartSkill = new Map();
		this.stat = new Map();
		this.rareIncreaseStat = new Map();
		this.phaseSkill = new Map();
		this.phaseIncreaseStat = new Map();

		FUNC.log("Created New Monster - (id : " + this.id + ", name : " + this.name + ")");
	}

	else {
		if (FUNC.checkType(Monster, monster) === null) {
			FUNC.log("Monster Copy Error", ENUM.LOG.error);
			return null;
		}

		this.id = monster.id;
		this.name = monster.name;
		this.rarePercent = monster.rarePercent;
		this.minDifficulty = 0;
		this.maxDifficulty = 999;
		this.mainField = monster.mainField;
		this.subField = monster.subField;
		this.phaseHealth = monster.phaseHealth;
		this.skill = monster.skill;
		this.phaseStartSkill = monster.phaseStartSkill;
		this.stat = monster.stat;
		this.rareIncreaseStat = monster.rareIncreaseStat;
		this.phaseSkill = monster.phaseSkill;
		this.phaseIncreaseStat = monster.phaseIncreaseStat;

		FUNC.log("Copied Monster(id : " + this.id + ", name : " + this.name + ")");
	}
}
Monster.toObject = function (monster) {
	var obj;
	var monsterData = new Object();

	monsterData.id = monster.id;
	monsterData.name = monster.name;
	monsterData.rarePercent = monster.rarePercent;
	monsterData.minDifficulty = monster.minDifficulty;
	monsterData.maxDifficulty = monster.maxDifficulty;
	monsterData.mainField = monster.mainField;
	monsterData.subField = monster.subField;
	monsterData.phaseHealth = monster.phaseHealth;
	monsterData.skill = monster.skill;
	monsterData.phaseStartSkill = FUNC.mapToObj(monster.phaseStartSkill);
	monsterData.stat = FUNC.mapToObj(monster.stat);
	monsterData.rareIncreaseStat = FUNC.mapToObj(monster.rareIncreaseStat);
	monsterData.phaseSkill = FUNC.mapToObj(monster.phaseSkill);

	monsterData.phaseIncreaseStat = new Array();
	for (var [phase, stat2Map] of monster.phaseIncreaseStat) {
		obj = new Object();
		obj.key = phase;
		obj.value = FUNC.mapToObj(stat2Map);
		monsterData.phaseIncreaseStat.push(obj);
	}

	return monsterData;
}
Monster.fromObject = function (monsterData) {
	var key1, key2;
	var value;
	var monster = new Monster(null);

	monster.id = Number(monsterData.id);
	monster.name = String(monsterData.name);
	monster.rarePercent = Number(monsterData.rarePercent);
	monster.minDifficulty = Number(monsterData.minDifficulty);
	monster.maxDifficulty = Number(monsterData.maxDifficulty);
	monster.mainField = new Array(monsterData.mainField);
	monster.subField = new Array(monsterData.subField);
	monster.phaseHealth = new Array(monsterData.phaseHealth);
	monster.skill = new Array(monsterData.skill);
	monster.phaseStartSkill = FUNC.objToMap(monsterData.phaseStartSkill);
	monster.stat = FUNC.objToMap(monsterData.stat);
	monster.rareIncreaseStat = FUNC.objToMap(monsterData.rareIncreaseStat);

	var map = new Map();
	for (var element of monster.phaseSkill)
		map.set(element.key, new Array(element.value));
	monster.phaseSkill = map;

	monster.phaseIncreaseStat = new Map();
	for (var obj of monsterData.phaseIncreaseStat) {
		key1 = Number(obj.key);

		player.mainStat.set(key1, new Map());
		for (var stat2Map of obj.value) {
			key2 = Number(stat2Map.key);
			value = Number(stat2Map.value);

			player.mainStat.get(key1).set(key2, value);
		}
	}

	return monster;
}

function Player(nickName, name, ImageDB, room, player) {
	//[테스트 칭호] 남식
	this.getFullName = function () {
		return "[" + this.nowTitle + "] " + this.nickName;
	}
	this.getAvailableNpc = function () {
		var output = new Array();

		for (var [npcId, npc] of VAR.npcs) {
			if (npc.name.startsWith("[시스템]"))
				output.push(npcId);
			else if (FUNC.compareCoord(npc.coord, this.coord))
				output.push(npcId);
		}

		return output;
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
		if (chat.wait.length !== 0) {
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
		var totalPercent = availableChat[0];
		var random = FUNC.random(1, totalPercent);
		var chatId = -1;

		var value = 0;
		for (var chat of availableChat) {
			value += chat.get("percent");

			if (value <= random) {
				chatId = chat.get("chat");
				break;
			}
		}

		var chat = VAR.chats.get(chatId);
		this.sendText(chat.id, npc.name);
		this.addLog(ENUM.LOGNAME.npcChat, 1);
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
	this.canAddSkill = function (skillId) {
		var temp = FUNC.checkNaN(skillId, 1, VAR.skills.size);

		if (temp === null)
			return false;

		var skill = VAR.skills.get(temp);
		if (skill.limitLv <= this.lv &&
			FUNC.check(skill.limitStat, this.mainStat.get(ENUM.STAT1.totalStat), ENUM.CHECKING.big, false, true))
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
			this.addLog(ENUM.LOGNAME.questCleared, 1);
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
	this.handlePassive = function () {
		for (var s of this.skill) {
			if (s.isPassive)
				s.use(this.id, this.id, true);
		}
	}
	this.isDdos = function () {
		var time = FUNC.time();

		if (time - this.ddosCheck < VAR.ddosTime)
			return true;

		this.setDdosCheck(time);
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
			this.addLog(ENUM.LOGNAME.statUpdated, 1);
		}

		this.handlePassive();
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
	this.getLog = function (logNameEnum) {
		var temp = FUNC.checkNaN(logNameEnum);
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
			this.addLog(ENUM.LOGNAME.moveDistance, distance);
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
				value = this.getLog(ENUM.LOGNAME.maxMoney);
				if (temp > value)
					this.setLog(ENUM.LOGNAME.maxMoney, temp);
			}

			else {
				value = this.getLog(ENUM.LOGNAME.maxPayment);
				if (temp < value)
					this.setLog(ENUM.LOGNAME.maxPayment, temp);
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
	this.setDdosCheck = function (time) {
		var temp = FUNC.checkNaN(time, 0);
		if (temp !== null) this.ddosCheck = temp;
	}
	this.setNowChat = function (chatId) {
		var temp = FUNC.checkNaN(chatId, 0, VAR.chats.size);
		if (temp !== null) this.nowChat = temp;
	}
	this.setBuilding = function (buildingId) {
		var temp = FUNC.checkNaN(buildingId, 0, VAR.buildings.size);
		if (temp !== null) this.building = temp;
	}
	this.setNowMonster = function (monsterId) {
		var temp = FUNC.checkNaN(monsterId, 0, VAR.monsters.size);
		if (temp !== null) this.nowMonster = temp;
	}
	this.setNowPlayer = function (playerId) {
		var temp = FUNC.checkNaN(playerId, 0, VAR.players.size);
		if (temp !== null) this.nowPlayer = temp;
	}
	this.setDoing = function (doingEnum) {
		var temp = FUNC.checkNaN(doingEnum, 0);
		if (temp !== null) this.doing = temp;
	}
	this.setCanCommand = function (canCommand) {
		var temp = FUNC.checkType(Boolean, canCommand);
		if (temp !== null) this.canCommand = temp;
	}
	this.setIsFighting = function (isFighting) {
		var temp = FUNC.checkType(Boolean, isFighting);
		if (temp !== null) this.isFighting = temp;
	}
	this.setIsPvpOn = function (isPvpOn) {
		var temp = FUNC.checkType(Boolean, isPvpOn);
		if (temp !== null) this.isPvpOn = temp;
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
	this.setMainStat = function (stat1Enum, stat2Enum, mainStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(mainStat, 0);

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
	this.setResistStat = function (typeEnum, resistStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(resistStat, 0);

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
					this.addLog(ENUM.LOGNAME.usedItem, value);

					return;
				}

				if (!ignore) {
					FUNC.log("setInventory Error", ENUM.LOG.error);
					return;
				}
			}

			this.inventory.set(temp1, temp2);

			if (changed < 0)
				this.addLog(ENUM.LOGNAME.usedItem, changed);
			else
				this.addLog(ENUM.LOGNAME.gottenItem, changed);

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

			var maxCloseRate = this.getLog(ENUM.LOGNAME.maxCloseRate);
			maxCloseRate = typeof maxCloseRate === "undefined" ? 0 : maxCloseRate;
			if (temp2 > maxCloseRate)
				this.setLog(ENUM.LOGNAME.maxCloseRate, temp2);
			this.addLog(ENUM.LOGNAME.totalCloseRate, temp2);

			this.handleQuest();
			this.handleAchieve();
		}
	}
	this.setLog = function (logNameEnum, logData) {
		var temp1 = FUNC.checkNaN(logNameEnum);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			this.log.set(temp1, temp2);
			this.handleAchieve();
		}
	}
	this.setType = function (typeEnum, typeLv, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(typeLv);

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
	this.setBuff = function (stat2Enum, remainTime, buffStat, ignore) {
		ignore = typeof ignore === "undefined" ? false : true;
		var temp1 = FUNC.checkNaN(stat2Enum);
		var temp2 = FUNC.checkNaN(remainTime, 0) + FUNC.time();
		var temp3 = FUNC.checkNaN(buffStat);

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
			this.addLog(ENUM.LOGNAME.buffReceived, 1);
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
			if (typeof FUNC.findValue(this.nowQuest, temp) === "undefined") {
				this.nowQuest.push(temp);
				this.addLog(ENUM.LOGNAME.questReceived, 1);
			}

			else
				FUNC.log("addNowQuest Error", ENUM.LOG.error);
		}
	}
	this.addSkill = function (skillId) {
		var temp = FUNC.checkNaN(skillId);

		if (temp !== null) {
			if (typeof FUNC.findValue(this.skill, temp) === "undefined")
				this.skill.push(temp);
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
	this.addMainStat = function (stat1Enum, stat2Enum, mainStat) {
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(mainStat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getMainStat(temp1, temp2);

			if (typeof value === "undefined")
				this.setMainStat(temp1, temp2);
			else
				this.setMainStat(temp1, value + temp2, true);
		}
	}
	this.addResistStat = function (typeEnum, resistStat) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(resistStat);

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
	this.addLog = function (logNameEnum, logData) {
		var temp1 = FUNC.checkNaN(logNameEnum);
		var temp2 = FUNC.checkNaN(logData);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getLog(temp1);
			if (typeof value === "undefined")
				this.setLog(temp1, temp2);
			else
				this.setLog(temp1, value + temp2);
		}
	}
	this.addType = function (typeEnum, typeLv) {
		var temp1 = FUNC.checkNaN(typeEnum);
		var temp2 = FUNC.checkNaN(typeLv);

		if (temp1 !== null && temp2 !== null) {
			var value = this.getType(temp1);
			if (typeof value === "undefined")
				this.setType(temp1, temp2);
			else
				this.setType(temp1, value + temp2, true);
		}
	}
	this.addBuff = function (stat1Enum, stat2Enum, buffStat) {
		var temp1 = FUNC.checkNaN(stat1Enum);
		var temp2 = FUNC.checkNaN(stat2Enum);
		var temp3 = FUNC.checkNaN(buffStat);

		if (temp1 !== null && temp2 !== null && temp3 !== null) {
			var value = this.getBuff(temp1, temp2);
			if (typeof value === "undefined")
				this.setBuff(temp1, temp2);
			else
				this.setBuff(temp1, value + temp2, true);
		}
	}

	//Constructor
	if (typeof player === "undefined") {
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
		this.nowChat = 0;
		this.building = 0;
		this.nowMonster = 0;
		this.nowPlayer = 0;
		this.doing = ENUM.DOING.none;
		this.canCommand = true;
		this.isFighting = false;
		this.isPvpOn = true;
		this.achieve = new Array();
		this.research = new Array();
		this.title = new Array();
		this.nowQuest = new Array();
		this.skill = new Array();
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


		//스텟 init
		this.mainStat.set(ENUM.STAT1.actStat, new Map());
		this.mainStat.set(ENUM.STAT1.basicStat, new Map());
		this.mainStat.set(ENUM.STAT1.buffStat, new Map());
		this.mainStat.set(ENUM.STAT1.equipStat, new Map());
		this.mainStat.set(ENUM.STAT1.increStat, new Map());
		this.mainStat.set(ENUM.STAT1.levelStat, new Map());
		this.mainStat.set(ENUM.STAT1.quickStat, new Map());
		this.mainStat.set(ENUM.STAT1.totalStat, new Map());

		for (var i = 0; i <= ENUM.STAT2.max; i++) {
			this.mainStat.get(ENUM.STAT1.actStat).set(i, 0);
			this.mainStat.get(ENUM.STAT1.buffStat).set(i, 0);
			this.mainStat.get(ENUM.STAT1.equipStat).set(i, 0);
			this.mainStat.get(ENUM.STAT1.levelStat).set(i, 0);
			this.mainStat.get(ENUM.STAT1.quickStat).set(i, 0);
		}

		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.acc, 5);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.atk, 1);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.bre, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.cd, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.def, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.dra, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.eg, 100);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.eva, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.hp, 10);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.matk, 1);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxeg, 100);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxhp, 10);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.maxmn, 100);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mbre, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mdef, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mdra, 0);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.mn, 100);
		this.mainStat.get(ENUM.STAT1.basicStat).set(ENUM.STAT2.spd, 100);

		this.updateStat();

		this.title.push("뉴비");
		this.nowTitle = "뉴비";

		for (var i = 0; i <= ENUM.JOB.max; i++)
			this.job.set(i, 1);

		for (var i = 0; i <= ENUM.TYPE.max; i++) {
			this.type.set(i, 0);
			this.resistStat.set(i, 0);
		}

		this.setLog(ENUM.LOGNAME.createdTime, FUNC.time());
		FUNC.log("Created New Player - (id : " + this.id + ", name : " + this.name + ")");
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
		this.nowChat = player.nowChat;
		this.building = player.building;
		this.nowMonster = player.nowMonster;
		this.nowPlayer = player.nowPlayer;
		this.doing = player.doing;
		this.canCommand = player.canCommand;
		this.isFighting = player.isFighting;
		this.isPvpOn = player.isPvpOn;
		this.achieve = player.achieve;
		this.research = player.research;
		this.title = player.title;
		this.nowQuest = player.nowQuest;
		this.skill = player.skill;
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
}
Player.toObject = function (player) {
	var obj;
	var playerData = new Object();

	playerData.id = player.id;
	playerData.nickName = player.nickName;
	playerData.name = player.name;
	playerData.image = player.image;
	playerData.lastTime = player.lastTime;
	playerData.recentRoom = player.room;
	playerData.coord = Coordinate.toObject(player.coord);
	playerData.nowTitle = player.nowTitle;
	playerData.money = player.money;
	playerData.lv = player.lv;
	playerData.exp = player.exp;
	playerData.sp = player.sp;
	playerData.adv = player.adv;
	playerData.ddosCheck = player.ddosCheck;
	playerData.nowChat = player.nowChat;
	playerData.building = player.building;
	playerData.nowMonster = player.nowMonster;
	playerData.nowPlayer = player.nowPlayer;
	playerData.doing = player.doing;
	playerData.canCommand = player.canCommand;
	playerData.isFighting = player.isFighting;
	playerData.isPvpOn = player.isPvpOn;
	playerData.achieve = player.achieve;
	playerData.research = player.research;
	playerData.title = player.title;
	playerData.nowQuest = player.nowQuest;
	playerData.skill = player.skill;
	playerData.job = FUNC.mapToObj(player.job);
	playerData.resistStat = FUNC.mapToObj(player.resistStat);
	playerData.inventory = FUNC.mapToObj(player.inventory);
	playerData.equipped = FUNC.mapToObj(player.equipped);
	playerData.clearedQuest = FUNC.mapToObj(player.clearedQuest);
	playerData.closeRate = FUNC.mapToObj(player.closeRate);
	playerData.log = FUNC.mapToObj(player.log);
	playerData.type = FUNC.mapToObj(player.type);

	playerData.mainStat = new Array();
	for (var [stat1Enum, stat2Map] of player.mainStat) {
		obj = new Object();
		obj.key = stat1Enum;
		obj.value = FUNC.mapToObj(stat2Map);
		playerData.mainStat.push(obj);
	}

	playerData.buff = new Array();
	for (var [stat2Enum, buffMap] of player.buff) {
		obj = new Object();
		obj.key = stat2Enum;
		obj.value = FUNC.mapToObj(buffMap);
		playerData.buff.push(obj);
	}

	return playerData;
}
Player.fromObject = function (playerData) {
	var key1, key2;
	var value;
	var player = new Player(null, null, null, null);

	player.id = Number(playerData.id);
	player.nickName = String(playerData.nickName);
	player.name = String(playerData.name);
	player.image = Number(playerData.image);
	player.lastTime = Number(playerData.lastTime);
	player.recentRoom = player.room;
	player.coord = Coordinate.fromObject(playerData.coord);
	player.nowTitle = String(playerData.nowTitle);
	player.money = Number(playerData.money);
	player.lv = Number(player.lv);
	player.exp = Number(playerData.exp);
	player.sp = Number(playerData.sp);
	player.adv = Number(playerData.adv);
	player.ddosCheck = Number(playerData.ddosCheck);
	player.nowChat = Number(playerData.nowChat);
	player.building = Number(playerData.building);
	player.nowMonster = Number(playerData.nowMonster);
	player.nowPlayer = Number(playerData.nowPlayer);
	player.doing = Number(playerData.doing);
	player.canCommand = Boolean(playerData.canCommand);
	player.isFighting = Boolean(playerData.isFighting);
	player.isPvpOn = Boolean(playerData.isPvpOn);
	player.achieve = new Array(playerData.achieve);
	player.research = new Array(playerData.research);
	player.title = new Array(playerData.title);
	player.nowQuest = new Array(playerData.nowQuest);
	player.skill = new Array(playerData.skill);
	player.job = FUNC.objToMap(playerData.job);
	player.resistStat = FUNC.objToMap(playerData.resistStat);
	player.inventory = FUNC.objToMap(playerData.inventory);
	player.equipped = FUNC.objToMap(playerData.equipped);
	player.clearedQuest = FUNC.objToMap(playerData.clearedQuest);
	player.closeRate = FUNC.objToMap(playerData.closeRate);
	player.log = FUNC.objToMap(playerData.log);
	player.type = FUNC.objToMap(playerData.type);

	player.mainStat = new Map();
	for (var obj of playerData.mainStat) {
		key1 = String(obj.key);

		player.mainStat.set(key1, new Map());
		for (var stat2Map of obj.value) {
			key2 = Number(stat2Map.key);
			value = Number(stat2Map.value);

			player.mainStat.get(key1).set(key2, value);
		}
	}

	player.buff = new Map();
	for (var obj of playerData.buff) {
		key1 = Number(obj.key);

		player.buff.set(key1, new Map());
		for (var buffMap of obj.value) {
			key2 = Number(buffMap.key);
			value = Number(buffMap.value);

			player.buff.get(key1).set(key2, value);
		}
	}

	return player;
}

var evalNumber = 0;
var evalError = 0;
var evalTime;
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
	if (!room.includes("[CNKB]"))
		return;

	msg = msg.trim();

	try {
		if (typeof FUNC.findValue(VAR.rooms, room) === "undefined")
			VAR.rooms.push(room);

		if (msg.startsWith("neval ")) {
			var split = msg.split(" ");

			if (split[1] === "start") {
				evalNumber = FUNC.random(100000, 999999);
				evalTime = FUNC.time();

				Api.makeNoti("Eval Number", String(evalNumber), 1);
			}

			else if (split[1] === "end") {
				evalNumber = 0;
				replier.reply("Eval Number를 만료시켰습니다");
			}

			else if (split[1] === "eval") {
				if (evalNumber === 0)
					replier.reply("Eval Number를 생성해주십시오");

				else if (FUNC.time() > evalTime + (1000 * 60 * 5)) {
					evalNumber = 0;
					replier.reply("Eval Number는 이미 만료되었습니다");
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

		else {
			var player = FUNC.findPlayer(sender, ImageDB);

			if (typeof player === "undefined")
				nonPlayerFunc(room, msg, sender, replier, ImageDB);

			else {
				if (msg === "이모티콘을 보냈습니다.") {
					player.addLog(ENUM.LOGNAME.emoteSent, 1);
					return;
				}

				else if (player.isDdos()) {
					replier.reply("채팅의 간격은 최소 " + VAR.ddosTime + "ms 이어야 합니다");
					return;
				}

				player.addLog(ENUM.LOGNAME.chat, 1);

				if (playerFunc(player, msg, sender, replier)) {
					var time = new Date();
					var lastTime = new Date(player.lastTime);

					if (time.getDate() !== lastTime.getDate())
						player.addLog(ENUM.LOGNAME.playedDay, 1);

					player.setLastTime(time);
					player.setRecentRoom(room);

					VAR.msgCount++;
					if (msgCount >= 100)
						FUNC.saveDB();
				}
			}
		}
	} catch (e) {
		FUNC.log("<RUNTIME> - " + e, ENUM.LOG.error);
		replier.reply("런타임 에러 - " + e);
	}
}

function nonPlayerFunc(room, msg, sender, replier, ImageDB) {
	var split = msg.split(" ");

	//회원가입 구문
	if (split[0] === "..가입" || split[0] === "..회원가입") {
		if (typeof split[1] === "undefined")
			replier.reply("\"(..가입 / ..회원가입) [닉네임]\" 의 형식으로 재입력해주세요");

		else {
			for (var player of VAR.players.values()) {
				if (player.nickName === split[1]) {
					replier.reply("해당 닉네임은 이미 사용중입니다.\n다른 닉네임으로 시도해주세요");
					return;
				}
			}

			var player = new Player(split[1], sender, ImageDB, room);
			player.addInventory(1, 1);
			player.executeChat(1);
			FUNC.saveInstance(ENUM.ID.player, player);

			FUNC.saveDB();
		}
	}

	//명령어 출력
	else if (split[0] === "..명령어")
		FUNC.showCommands(room);
}

function playerFunc(player, msg, sender, replier) {
	var split = msg.split(" ");

	//회원가입 실패 - 이름 + 프로필 중복
	if (split[0] === "..가입") {
		replier.reply(sender + "님과 이름 및 프로필 이미지가 동일한 유저가 이미 존재합니다.\n이름 또는 프로필 이미지 변경 다시 시도해주세요");
		return true;
	}

	//명령어 출력
	else if (split[0] === "..명령어")
		FUNC.showCommands(room);

	//명령어 사용 가능 여부에 따라 명령어가 막히는 구간
	if (!player.canCommand) {
		FUNC.reply(player.id, "현재 명령어를 실행할 수 없는 상태입니다");
		return true;
	}

	return false;
}

//eval 실행
function initDataBase() {
	var map, map_, array;

	var item, quest, chat, npc;

	// --- 아이템 --- //
	//이상한 돌
	item = new Item("이상한 돌");
	item.description = "말을 할 때마다 빛나는 이상한 돌이다.\n감정을 받아봐야 할 것 같다.";
	FUNC.saveInstance(ENUM.ID.item, item);

	//설화를 먹는 돌
	item = new Item("설화를 먹는 돌");
	item.description = "주변에서 말을 하거나 누군가가 죽는 등의 여러 상황에서 빛나는 돌이다";
	item.handleLevel = 10;
	FUNC.saveInstance(ENUM.ID.item, item);

	// --- 퀘스트 --- //
	//이상한 돌 감정
	quest = new Quest("이상한 돌 감정!");

	map = new Map();
	map.set(1, 1);
	quest.needItem = map;

	map = new Map();
	map.set(2, 1);
	quest.rewardItem = map;

	quest.rewardExp = 102;

	FUNC.saveInstance(ENUM.ID.quest, quest);

	// --- 채팅 --- //
	//회원가입
	chat = new Chat();
	chat.id = 1;

	array = new Array();
	array.push("CNKB Rpg에 오신것을 환영합니다.");
	chat.text = array;

	map = new Map();
	map.set(ENUM.WAIT_RESPONSE.nothing, 2);	//스토리로 이동
	chat.chat = map;

	FUNC.saveInstance(ENUM.ID.chat, chat);

	//배경 스토리
	chat = new Chat();
	chat.id = 2;

	array = new Array();
	array.push("배경 스토리\n(스토리는 게임에 영향을 미치니 읽어보시는 것을 추천드립니다)");
	array.push("어릴 때 할아버지와 함께 살다, 할아버지는 돌아가시고 혼자 작은 마을에 살며 자급자족을 해왔음");
	array.push("그러던 어느 날, 말할 떄 마다 빛나는 이상한 돌을 산속에서 발견하여 감정을 위해 큰 도시로 이동함");
	array.push("보석 감정인에게 말을 걸어주세요");
	chat.text = array;

	chat.quest = 1;

	FUNC.saveInstance(ENUM.ID.chat, chat);

	//스토리 시작
	chat = new Chat();
	chat.id = 3;

	array = new Array();
	array.push("음 신비한 돌이라.... 언젠가 책에서 이런 돌을 본 적이 있긴 하지");
	array.push("잠시만 기다려보시게");
	chat.text = array;

	FUNC.saveInstance(ENUM.ID.chat, chat);

	// --- 엔피시 --- //
	//시스템
	npc = new Npc("[시스템]");

	array = new Array();

	map = new Map();
	map.set("chat", 1);
	map.set("percent", -1);
	map.set("minLv", 1);
	map.set("minCloseRate", 0);
	map.set("minStat", new Map());
	map.set("minQuest", new Map());
	map.set("maxLv", 999);
	map.set("maxCloseRate", 0);
	map.set("maxStat", new Map());
	map_ = new Map();
	map_.set(1, 0);
	map.set("maxQuest", map_);

	array.push(map);

	FUNC.saveInstance(ENUM.ID.npc, npc);
}

function onStartCompile() {
	initDataBase();
	FUNC.loadDB();
}
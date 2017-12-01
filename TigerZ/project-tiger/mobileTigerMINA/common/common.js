//公用函数
var factory = {
  //请求数据地址
  tigerDomain: 'api.tigerz.nz',
  //图片地址
  imgDomain: 'https://aus.tigerz.nz/',
  // json数据
  _JSON1: {
    "all": [
      {
        "en": "Auckland",
        "cn": "奥克兰"
      },
      {
        "en": "Wellington",
        "cn": "惠灵顿"
      },
      {
        "en": "Canterbury",
        "cn": "坎特伯雷"
      },
      {
        "en": "Northland",
        "cn": "北部地区"
      },
      {
        "en": "Bay of Plenty",
        "cn": "丰盛湾"
      },
      {
        "en": "Waikato",
        "cn": "怀卡托"
      },
      {
        "en": "Hawkes Bay",
        "cn": "霍克斯湾"
      },
      {
        "en": "Taranaki",
        "cn": "塔拉纳基"
      },
      {
        "en": "Manawatu / Wanganui",
        "cn": "马纳瓦图/旺加努伊"
      },
      {
        "en": "Wairarapa",
        "cn": "怀拉拉帕"
      },
      {
        "en": "Southland",
        "cn": "南岛地区"
      }
    ],
    "Northland": {
      "hotSearch": [
        {
          "en": "Far North",
          "cn": "Far North"
        },
        {
          "en": "Whangarei",
          "cn": "Whangarei"
        },
        {
          "en": "Kaipara",
          "cn": "Kaipara"
        }
      ],
      "city": [
        "Far North",
        "Whangarei",
        "Kaipara"
      ],
      "school": {
        "Far North": [

        ],
        "Whangarei": [

        ],
        "Kaipara": [

        ]
      },
      "suburb": {
        "Far North": [
          "Kohukohu",
          "Kerikeri",
          "Kaikohe",
          "Cable Bay",
          "Nukutawhiti",
          "Waimate North",
          "Coopers Beach",
          "Matauri Bay",
          "Ohaeawai",
          "Haruru",
          "Motatau",
          "Ahipara",
          "Pipiwai",
          "Awarua",
          "Matawaia",
          "Taipa",
          "Peria",
          "Russell",
          "Moerewa",
          "Paewhenua Island",
          "Ngawha Springs",
          "Pakotai",
          "Whangaroa",
          "Kaeo",
          "Kaingaroa",
          "Waitangi",
          "Towai",
          "Pakaraka",
          "Opua",
          "Maromaku",
          "Waiomio",
          "Kaitaia",
          "Paihia",
          "Pukewharariki",
          "Punakitere Valley",
          "Horeke",
          "Kaikohe Surrounds",
          "Kaitaia Surrounds",
          "Kawakawa Surrounds",
          "Russell Surrounds",
          "Kerikeri Surrounds",
          "North Hokianga",
          "Mangonui",
          "Taupo Bay/Totara North",
          "Awanui",
          "Houhora",
          "Herekino",
          "Opononi",
          "Rawene",
          "Mangamuka",
          "Karikari Peninsula",
          "Kawakawa",
          "Omapere",
          "Kaikohe West",
          "Whangaroa/Kaeo Surrounds",
          "Paihia Surrounds",
          "Hokianga Surrounds",
          "Okaihau",
          "Mangonui Surrounds",
          "South Hokianga",
          "Takahue",
          "Pukenui"
        ],
        "Whangarei": [
          "One Tree Point",
          "Kensington",
          "Parua Bay",
          "Kiripaka",
          "Tamaterau",
          "Poroti",
          "Tikipunga",
          "Langs Beach",
          "Morningside",
          "Whareora",
          "Horahora",
          "Avenues",
          "Whau Valley",
          "Kokopu",
          "Riverside",
          "Otangarei",
          "Whangarei Central",
          "Port Whangarei",
          "Ruakaka",
          "Woodhill",
          "Maungatapere",
          "Waipu",
          "Pataua",
          "Kauri",
          "Otaika",
          "Hikurangi",
          "Matapouri",
          "Tutukaka",
          "Whananaki",
          "Marsden Point",
          "Ngunguru",
          "Regent",
          "Raumanga",
          "Ruatangata",
          "Oakura Coast",
          "Whangarei Surrounds",
          "Onerahi",
          "Glenbervie",
          "Okara",
          "Parahaki",
          "Kamo",
          "Whakapara",
          "Maunu",
          "Mangapai and Surrounds",
          "Whangarei Heads",
          "Hukerenui and Surrounds",
          "Whangarei Area",
          "Maungakaramea",
          "Portland",
          "Oakleigh",
          "Matarau"
        ],
        "Kaipara": [
          "Mangawhai",
          "Ruawai",
          "Pouto",
          "Mangawhai Heads",
          "Maungaturoto",
          "Te Kopuru",
          "Arapohue",
          "Tinopai",
          "Whakapirau",
          "Mareretu",
          "Dargaville Surrounds",
          "Otamatea Surrounds",
          "Ruawai Surrounds",
          "Waipoua",
          "Dargaville",
          "Tangiteroria",
          "Kaiwaka",
          "Topuni",
          "Paparoa",
          "Matakohe"
        ]
      }
    },
    "Southland": {
      "hotSearch": [
        {
          "en": "Invercargill City",
          "cn": "Invercargill City"
        },
        {
          "en": "Southland",
          "cn": "Southland"
        },
        {
          "en": "Gore",
          "cn": "Gore"
        }
      ],
      "city": [
        "Invercargill City",
        "Southland",
        "Gore"
      ],
      "school": {
        "Invercargill City": [

        ],
        "Southland": [

        ],
        "Gore": [

        ]
      },
      "suburb": {
        "Invercargill City": [
          "Makarewa",
          "Ryal Bush",
          "Appleby",
          "Rockdale",
          "Waikiwi",
          "Windsor",
          "Newfield",
          "Richmond",
          "Waverley",
          "Prestonville",
          "Kingswell",
          "Georgetown",
          "Grasmere",
          "Kew",
          "Avenal",
          "West Plains",
          "Strathern",
          "Gladstone",
          "Rosedale",
          "Hargest",
          "Heidelberg",
          "Underwood",
          "Hawthorndale",
          "Glengarry",
          "Turnbull Thomson Park",
          "Invercargill Surrounds",
          "Oreti Beach",
          "Otatara",
          "Bluff",
          "Awarua",
          "Waimatua",
          "Invercargill",
          "Clifton",
          "Tisbury",
          "Mill Road",
          "Myross Bush",
          "Roslyn Bush",
          "Lorneville",
          "Ascot"
        ],
        "Southland": [
          "Woodlands",
          "Riverton & Surrounds",
          "Winton Surrounds",
          "Wyndham Surrounds",
          "Te Anau Surrounds",
          "Lumsden Surrounds",
          "Stewart Island",
          "Orepuki",
          "Nightcaps",
          "Ohai",
          "Otautau",
          "Thornbury",
          "Wallacetown",
          "Tuatapere",
          "Mossburn",
          "Manapouri",
          "Riversdale",
          "Waianiwa",
          "Balfour",
          "Dipton",
          "Edendale",
          "Garston",
          "Halfmoon Bay",
          "Lumsden",
          "Riverton",
          "Te Anau",
          "Waikaia",
          "Winton",
          "Wyndham",
          "Castlerock",
          "Colac Bay",
          "Hedgehope"
        ],
        "Gore": [
          "Mataura",
          "Waikaka",
          "Pukerau",
          "Gore Surrounds",
          "Gore"
        ]
      }
    },
    "Canterbury": {
      "hotSearch": [
        {
          "en": "Christchurch City",
          "cn": "基督城"
        },
        {
          "en": "Waimakariri",
          "cn": "Waimakariri"
        },
        {
          "en": "Selwyn",
          "cn": "Selwyn"
        },
        {
          "en": "Timaru",
          "cn": "Timaru"
        }
      ],
      "city": [
        "Christchurch City",
        "Waimakariri",
        "Selwyn",
        "Timaru",
        "Waimate",
        "Banks Peninsula",
        "Ashburton",
        "Hurunui",
        "Mackenzie"
      ],
      "school": {
        "Christchurch City": [
          {
            "name": "Christchurch Boys' High School",
            "id": "5840ea261cab461c20cf534e"
          },
          {
            "name": "Christchurch Girls' High School | Te Kura o Hine Wairoa",
            "id": "5840ea6b1cab461c20cf566c"
          },
          {
            "name": "Middleton Grange School (Years 1 - 10)",
            "id": "5840ea981cab461c20cf58aa"
          },
          {
            "name": "Middleton Grange School (Years 11 - 13)",
            "id": "5840ea981cab461c20cf58ab"
          }
        ],
        "Waimakariri": [

        ],
        "Selwyn": [

        ],
        "Timaru": [

        ],
        "Waimate": [

        ],
        "Banks Peninsula": [

        ],
        "Ashburton": [

        ],
        "Hurunui": [

        ],
        "Mackenzie": [

        ]
      },
      "suburb": {
        "Christchurch City": [
          "Islington",
          "Parklands",
          "Redcliffs",
          "Ilam",
          "Styx",
          "Shirley",
          "Saint Martins",
          "Cashmere",
          "Upper Riccarton",
          "Mairehau",
          "Clifton",
          "Coutts Island",
          "Avondale",
          "Huntsbury",
          "Saint Albans",
          "North New Brighton",
          "Middleton",
          "Phillipstown",
          "Mount Pleasant",
          "Christchurch Central",
          "Sydenham",
          "Westmorland",
          "Bromley",
          "Christchurch Airport",
          "Spreydon",
          "Northcote",
          "Somerfield",
          "Avonhead",
          "Russley",
          "Cracroft",
          "Heathcote Valley",
          "Harewood",
          "Hillsborough",
          "Bryndwr",
          "Strowan",
          "Halswell",
          "Ferrymead",
          "Avonside",
          "Moncks Bay",
          "Hillmorton",
          "New Brighton",
          "Aranui",
          "Waltham",
          "Bishopdale",
          "South New Brighton",
          "Marshland",
          "Kainga",
          "Richmond Hill",
          "Templeton",
          "Sockburn",
          "Redwood",
          "Wigram",
          "Papanui",
          "Northwood",
          "Sumner",
          "Southshore",
          "Opawa",
          "Waimairi Beach",
          "Broomfield",
          "Burnside",
          "Linwood",
          "Beckenham",
          "Kennedys Bush",
          "Addington",
          "Merivale",
          "Burwood",
          "Richmond",
          "Edgeware",
          "Belfast",
          "Bexley",
          "Hoon Hay",
          "Hei Hei",
          "Dallington",
          "Casebrook",
          "Riccarton",
          "Woolston",
          "Wainoni",
          "Fendalton",
          "Christchurch Surrounds",
          "Yaldhurst",
          "Hornby",
          "Brooklands",
          "Spencerville",
          "Aidanfield"
        ],
        "Waimakariri": [
          "Waikuku Beach",
          "Tuahiwi",
          "Clarkville",
          "Ashley",
          "Ohoka",
          "Pegasus",
          "Cust",
          "Waikuku",
          "Sefton",
          "Swannanoa",
          "Waimakariri Surrounds",
          "Oxford",
          "West Eyreton",
          "Woodend",
          "Glentui",
          "Kaiapoi",
          "Rangiora",
          "Okuku",
          "Loburn",
          "Fernside",
          "The Pines Beach"
        ],
        "Selwyn": [
          "Windwhistle",
          "Southbridge",
          "Tai Tapu",
          "Lake Coleridge",
          "Glentunnel",
          "Doyleston",
          "Castle Hill",
          "Lansdowne",
          "Prebbleton",
          "Kirwee",
          "Waddington",
          "West Melton",
          "Springston",
          "Rolleston",
          "Malvern Hills",
          "Burnham",
          "Hororata",
          "Sheffield",
          "Leeston",
          "Lake Pearson",
          "Selwyn Surrounds",
          "Motukarara",
          "Arthur's Pass",
          "Darfield",
          "Dunsandel",
          "Lincoln",
          "Springfield",
          "Craigieburn",
          "Weedons"
        ],
        "Timaru": [
          "Glenwood",
          "Kensington",
          "Maori Hill",
          "Smithfield",
          "Highfield",
          "Rosewill",
          "Redruth",
          "Watlington",
          "Winchester",
          "Waimataitai",
          "Marchwiel",
          "Seaview",
          "Parkside",
          "Clandeboye",
          "West End",
          "Gleniti",
          "Timaru Surrounds",
          "Geraldine",
          "Fairview",
          "Pareora",
          "Mesopotamia",
          "Washdyke",
          "Hadlow",
          "Timaru Central",
          "Levels",
          "Temuka",
          "Pleasant Point"
        ],
        "Waimate": [
          "Otaio",
          "Morven",
          "Waitangi",
          "Ikawai",
          "Maungati",
          "Hunter",
          "Makikihi",
          "Waihao Downs",
          "Elephant Hill",
          "Kirkliston",
          "Glenavy",
          "Waihaorunga",
          "Hunters Hills",
          "Waimate",
          "Hakataramea",
          "St Andrews",
          "Waimate Surrounds",
          "Saint Andrews",
          "Hakataramea Valley"
        ],
        "Banks Peninsula": [
          "Corsair Bay",
          "Cass Bay",
          "Takamatua",
          "Pigeon Bay",
          "Charteris Bay",
          "Lyttelton",
          "Robinsons Bay",
          "French Farm",
          "Diamond Harbour",
          "Okains Bay",
          "Purau",
          "Birdlings Flat",
          "Duvauchelle",
          "Port Levy",
          "Little Akaloa",
          "Le Bons Bay",
          "Banks Peninsula Surrounds",
          "Akaroa",
          "Governors Bay",
          "Little River",
          "Wainui"
        ],
        "Ashburton": [
          "Netherby",
          "Huntingdon/Lake Hood",
          "Lauriston",
          "Allenton",
          "Ashburton",
          "Hampstead",
          "Winchmore",
          "Tinwald",
          "Ashburton Surrounds",
          "Mayfield",
          "Methven",
          "Mount Somers",
          "Rakaia",
          "Hinds",
          "Lismore",
          "Fairton",
          "Chertsey",
          "Elgin",
          "Westerfield",
          "Winslow",
          "Eiffelton"
        ],
        "Hurunui": [
          "Pyramid Valley",
          "Balcairn",
          "Virginia",
          "Rotherham",
          "Leslie Hills",
          "Hurunui",
          "Scargill",
          "MacDonald Downs",
          "Waikari",
          "Leithfield",
          "Hurunui Surrounds",
          "Hanmer Springs",
          "Amberley",
          "Cheviot",
          "Culverden",
          "Gore Bay",
          "Hawarden",
          "Hundalee",
          "Waipara",
          "Motunau",
          "Waiau",
          "Lewis Pass",
          "Greta Valley",
          "Lyford"
        ],
        "Mackenzie": [
          "Albury",
          "Mt Cook",
          "Mackenzie Surrounds",
          "Lake Tekapo",
          "Fairlie",
          "Twizel"
        ]
      }
    },
    "Bay of Plenty": {
      "hotSearch": [
        {
          "en": "Tauranga",
          "cn": "Tauranga"
        },
        {
          "en": "Western Bay Of Plenty",
          "cn": "Western Bay Of Plenty"
        },
        {
          "en": "Rotorua",
          "cn": "Rotorua"
        },
        {
          "en": "Whakatane",
          "cn": "Whakatane"
        }
      ],
      "city": [
        "Tauranga",
        "Western Bay Of Plenty",
        "Rotorua",
        "Whakatane",
        "Kawerau",
        "Opotiki"
      ],
      "school": {
        "Tauranga": [

        ],
        "Western Bay Of Plenty": [

        ],
        "Rotorua": [

        ],
        "Whakatane": [

        ],
        "Kawerau": [

        ],
        "Opotiki": [

        ]
      },
      "suburb": {
        "Tauranga": [
          "Tauranga South",
          "Judea",
          "Maungatapu",
          "Poike",
          "Tauranga Central",
          "Gate Pa",
          "Hairini",
          "Bellevue",
          "Otumoetai",
          "Matua",
          "Brookfield",
          "Parkvale",
          "Tauriko",
          "Mount Maunganui",
          "Greerton",
          "Matapihi",
          "Bethlehem",
          "Tauranga Surrounds",
          "Welcome Bay",
          "Papamoa",
          "Avenues",
          "Pyes Pa",
          "Oropi",
          "Ohauiti"
        ],
        "Western Bay Of Plenty": [
          "Pyes Pa",
          "Pongakawa",
          "Ohauiti",
          "Wairoa",
          "Paengaroa",
          "Te Puna",
          "Omokoroa",
          "Oropi",
          "Maketu",
          "Pukehina",
          "Aongatete",
          "Whakamarama",
          "Te Puke",
          "Kaimai",
          "Waihi Beach",
          "Athenree",
          "Katikati",
          "Western BOP Surrounds",
          "Matakana Island",
          "Pahoia"
        ],
        "Rotorua": [
          "Springfield",
          "Westbrook",
          "Okere Falls",
          "Hillcrest",
          "Glenholme",
          "Lake Rotoma",
          "Mangakakahi",
          "Ngapuna",
          "Pukehangi",
          "Atiamuri",
          "Mourea",
          "Fordlands",
          "Hamurana",
          "Koutu",
          "Hannahs Bay",
          "Ohinemutu",
          "Tihiotonga",
          "Tikitere",
          "Lake Okareka",
          "Waikite Valley",
          "Fenton Park",
          "Rotorua Central",
          "Lake Tarawera",
          "Holdens Bay",
          "Lynmore",
          "Broadlands",
          "Selwyn Heights",
          "Utuhina",
          "Owhata",
          "Fairy Springs",
          "Kawaha Point",
          "Western Heights",
          "Mamaku",
          "Ngakuru",
          "Victoria",
          "Rotorua Surrounds",
          "Lake Areas",
          "Ngongotaha",
          "Reporoa and Surrounds",
          "Horohoro",
          "Whakarewarewa",
          "Rerewhakaaitu",
          "Rotoiti Forest",
          "Lake Rotoiti",
          "Lake Rotoehu"
        ],
        "Whakatane": [
          "Coastlands",
          "Manawahe",
          "Matahi",
          "Taneatua",
          "Otakiri",
          "Rotoma",
          "Thornton",
          "Edgecumbe",
          "Whakatane Surrounds",
          "Matata",
          "Ohope",
          "Whakatane",
          "Murupara Surrounds",
          "Waimana",
          "Te Teko",
          "Murupara"
        ],
        "Kawerau": [
          "Kawerau"
        ],
        "Opotiki": [
          "Te Kaha",
          "Opotiki Surrounds",
          "Waihau Bay",
          "Opotiki Coastal",
          "Opotiki and Surrounds"
        ]
      }
    },
    "Manawatu / Wanganui": {
      "hotSearch": [
        {
          "en": "Wanganui",
          "cn": "Wanganui"
        },
        {
          "en": "Palmerston North City",
          "cn": "Palmerston North City"
        },
        {
          "en": "Horowhenua",
          "cn": "Horowhenua"
        },
        {
          "en": "Tararua",
          "cn": "Tararua"
        }
      ],
      "city": [
        "Wanganui",
        "Palmerston North City",
        "Horowhenua",
        "Tararua",
        "Rangitikei",
        "Manawatu"
      ],
      "school": {
        "Wanganui": [

        ],
        "Palmerston North City": [

        ],
        "Horowhenua": [

        ],
        "Tararua": [

        ],
        "Rangitikei": [

        ],
        "Manawatu": [

        ]
      },
      "suburb": {
        "Wanganui": [
          "Kakatahi",
          "Wanganui East",
          "Wanganui Central",
          "Gonville",
          "Otamatea",
          "College Estate",
          "Mangamahu",
          "Marybank",
          "Kaitoke",
          "Bastia Hill",
          "Tawhero",
          "Durie Hill",
          "Saint Johns Hill",
          "Westmere",
          "Castlecliff",
          "Springvale",
          "Okoia",
          "Whangaehu",
          "Papaiti",
          "Aramoho",
          "Fordell",
          "Wanganui Surrounds",
          "Putiki",
          "Kai Iwi",
          "Parikino",
          "Brunswick",
          "Matahiwi"
        ],
        "Palmerston North City": [
          "Hokowhitu",
          "Ashhurst",
          "Takaro",
          "Cloverlea",
          "Whakarongo",
          "Milson",
          "Turitea",
          "Terrace End",
          "Westbrook",
          "Awapuni",
          "West End",
          "Summerhill",
          "Roslyn",
          "Longburn",
          "Kelvin Grove",
          "Palmerston North Central",
          "Aokautere",
          "Massey University",
          "Highbury",
          "Linton",
          "Palmerston North Surrounds",
          "Parklands",
          "Riverdale",
          "Fitzherbert"
        ],
        "Horowhenua": [
          "Tokomaru",
          "Foxton",
          "Moutoa",
          "Waitarere Beach",
          "Foxton Beach",
          "Ohau",
          "Shannon",
          "Horowhenua Surrounds",
          "Levin",
          "Waitarere",
          "Manakau",
          "Waikawa Beach",
          "Hokio Beach"
        ],
        "Tararua": [
          "Tiraumea",
          "Norsewood",
          "Dannevirke",
          "Pahiatua",
          "Eketahuna",
          "Woodville",
          "Pongaroa"
        ],
        "Rangitikei": [
          "Koitiata",
          "Hunterville",
          "Turakina",
          "Parewanui",
          "Ratana",
          "Lake Alice",
          "Mangaweka",
          "Rangitikei Surrounds",
          "Marton",
          "Taihape and Surrounds",
          "Bulls"
        ],
        "Manawatu": [
          "Rongotea",
          "Kairanga",
          "Pohangina",
          "Ohingaiti",
          "Kimbolton",
          "Bunnythorpe",
          "Rangiwahia",
          "Himatangi Beach",
          "Sanson",
          "Tiakitahuna",
          "Tangimoana",
          "Apiti",
          "Newbury",
          "Ohakea",
          "Opiki",
          "Halcombe",
          "Manawatu Surrounds",
          "Feilding",
          "Himatangi",
          "Cheltenham",
          "Waituna West"
        ]
      }
    },
    "Wairarapa": {
      "hotSearch": [
        {
          "en": "Masterton",
          "cn": "Masterton"
        },
        {
          "en": "South Wairarapa",
          "cn": "South Wairarapa"
        },
        {
          "en": "Carterton",
          "cn": "Carterton"
        }
      ],
      "city": [
        "Masterton",
        "South Wairarapa",
        "Carterton"
      ],
      "school": {
        "Masterton": [

        ],
        "South Wairarapa": [

        ],
        "Carterton": [

        ]
      },
      "suburb": {
        "Masterton": [
          "Mangapakeha",
          "Te Whiti",
          "Blairlogie",
          "Bideford",
          "Solway",
          "Whangaehu Valley",
          "Matahiwi",
          "Opaki",
          "Masterton Surrounds",
          "Riversdale Beach",
          "Masterton",
          "Tinui",
          "Upper Plain",
          "Mauriceville",
          "Kiriwhakapapa",
          "Wainuioru",
          "Castlepoint",
          "Mataikona",
          "Otahome"
        ],
        "South Wairarapa": [
          "Hinakura",
          "Tuturumuri",
          "Cape Palliser",
          "Featherston",
          "Greytown",
          "Martinborough",
          "Pirinoa",
          "Lake Ferry",
          "Tora"
        ],
        "Carterton": [
          "Carterton Surrounds",
          "Gladstone",
          "Te Wharau",
          "Carterton"
        ]
      }
    },
    "Auckland": {
      "hotSearch": [
        {
          "en": "Auckland City",
          "cn": "中区 City"
        },
        {
          "en": "Manukau City",
          "cn": "东区 Manukau"
        },
        {
          "en": "North Shore City",
          "cn": "北岸 North Shore"
        },
        {
          "en": "Waitakere City",
          "cn": "西区 Waitakere"
        }
      ],
      "city": [
        "Auckland City",
        "Manukau City",
        "North Shore City",
        "Waitakere City",
        "Hauraki Gulf Islands",
        "Papakura",
        "Rodney",
        "Franklin",
        "Waiheke Island"
      ],
      "school": {
        "Auckland City": [
          {
            "name": "Epsom Girls Grammar School",
            "id": "5840ea281cab461c20cf5355"
          },
          {
            "name": "Glendowie College",
            "id": "5840ea371cab461c20cf5405"
          },
          {
            "name": "Auckland Grammar",
            "id": "5840ea661cab461c20cf5633"
          }
        ],
        "Manukau City": [
          {
            "name": "Botany Downs Secondary College",
            "id": "5840ea1d1cab461c20cf52d0"
          },
          {
            "name": "Macleans College",
            "id": "5840ea901cab461c20cf583f"
          }
        ],
        "North Shore City": [
          {
            "name": "Rangitoto College",
            "id": "5840ea5a1cab461c20cf55c8"
          },
          {
            "name": "Albany Senior High School",
            "id": "5840ea661cab461c20cf5630"
          },
          {
            "name": "Long Bay College",
            "id": "5840ea8f1cab461c20cf5836"
          },
          {
            "name": "Takapuna Grammar School",
            "id": "5840eac81cab461c20cf5aff"
          },
          {
            "name": "Westlake Boys' High School",
            "id": "5840eae51cab461c20cf5c80"
          },
          {
            "name": "Westlake Girls' High School",
            "id": "5840eae51cab461c20cf5c81"
          }
        ],
        "Waitakere City": [
          {
            "name": "Hobsonville Point Secondary School",
            "id": "5840ea771cab461c20cf56f8"
          }
        ],
        "Hauraki Gulf Islands": [

        ],
        "Papakura": [

        ],
        "Rodney": [

        ],
        "Franklin": [

        ],
        "Waiheke Island": [

        ]
      },
      "suburb": {
        "Auckland City": [
          "Saint Heliers",
          "Avondale",
          "One Tree Hill",
          "Kohimarama",
          "Three Kings",
          "Saint Johns",
          "Hillsborough",
          "Mount Roskill",
          "Newmarket",
          "Glen Innes",
          "Grey Lynn",
          "Orakei",
          "Point England",
          "Saint Marys Bay",
          "Kingsland",
          "Ellerslie",
          "Mount Albert",
          "Greenlane",
          "Epsom",
          "Mission Bay",
          "Freemans Bay",
          "New Windsor",
          "Point Chevalier",
          "Meadowbank",
          "Westmere",
          "Mount Eden",
          "Herne Bay",
          "Remuera",
          "Panmure",
          "Penrose",
          "Waterview",
          "Sandringham",
          "Grafton",
          "Western Springs",
          "Mount Wellington",
          "Blockhouse Bay",
          "Onehunga",
          "Eden Terrace",
          "Royal Oak",
          "Glendowie",
          "Auckland Central",
          "Lynfield",
          "Ponsonby",
          "Otahuhu",
          "Parnell",
          "Stonefields",
          "Newton",
          "Morningside",
          "Waiotaiki Bay"
        ],
        "Manukau City": [
          "Somerville",
          "Flat Bush",
          "Pakuranga",
          "Totara Park",
          "Mangere Bridge",
          "Clendon Park",
          "Kawakawa Bay",
          "Beachlands",
          "Huntington Park",
          "Eastern Beach",
          "Howick",
          "Highland Park",
          "Goodwood Heights",
          "Sunnyhills",
          "Manurewa",
          "Cockle Bay",
          "Dannemora",
          "Randwick Park",
          "East Tamaki Heights",
          "Mangere",
          "Middlemore Hospital",
          "Maraetai",
          "Brookby",
          "Northpark",
          "Manukau",
          "Totara Heights",
          "Whitford",
          "Pakuranga Heights",
          "Shelly Park",
          "Clover Park",
          "Orere Point",
          "Ness Valley",
          "Farm Cove",
          "Half Moon Bay",
          "Otara",
          "Auckland Airport",
          "Mangere East",
          "East Tamaki",
          "Wattle Downs",
          "Favona",
          "Manurewa East",
          "Wiri",
          "Alfriston",
          "Burswood",
          "Weymouth",
          "Bucklands Beach",
          "Papatoetoe",
          "Botany Downs",
          "Golflands",
          "Mellons Bay",
          "Shamrock Park",
          "The Gardens",
          "Clevedon",
          "Manukau Heights",
          "Hillpark",
          "Mission Heights"
        ],
        "North Shore City": [
          "Wairau Valley",
          "Takapuna",
          "Milford",
          "Rothesay Bay",
          "Hillcrest",
          "Northcote Point",
          "Greenhithe",
          "Mairangi Bay",
          "Birkdale",
          "Castor Bay",
          "Long Bay",
          "Pinehill",
          "Torbay",
          "Forrest Hill",
          "Lucas Heights",
          "Waiake",
          "Okura",
          "Belmont",
          "Unsworth Heights",
          "Northcross",
          "Narrow Neck",
          "Sunnynook",
          "Bayview",
          "Schnapper Rock",
          "Chatswood",
          "Fairview Heights",
          "Oteha",
          "Albany",
          "Devonport",
          "Murrays Bay",
          "Browns Bay",
          "Northcote",
          "Totara Vale",
          "Birkenhead",
          "Glenfield",
          "Windsor Park",
          "Bayswater",
          "Campbells Bay",
          "Beach Haven",
          "Paremoremo",
          "Hauraki",
          "Rosedale",
          "Stanley Point"
        ],
        "Waitakere City": [
          "Bethells Beach",
          "Whenuapai",
          "Titirangi",
          "New Lynn",
          "Swanson",
          "Cornwallis",
          "Henderson",
          "Ranui",
          "Te Atatu Peninsula",
          "Hobsonville",
          "Laingholm",
          "Henderson Valley",
          "Oratia",
          "West Harbour",
          "Parau",
          "Glen Eden",
          "Waitakere",
          "Huia",
          "Sunnyvale",
          "Glendene",
          "Kelston",
          "Massey",
          "Waiatarua",
          "Te Atatu South",
          "Green Bay",
          "Karekare",
          "Herald Island",
          "Piha",
          "Westgate"
        ],
        "Hauraki Gulf Islands": [
          "Rakino Island",
          "Great Barrier Island",
          "Kawau Island",
          "Other Islands"
        ],
        "Papakura": [
          "Red Hill",
          "Rosehill",
          "Ardmore",
          "Runciman",
          "Pahurehure",
          "Opaheke",
          "Drury",
          "Papakura",
          "Takanini",
          "Conifer Grove",
          "Hingaia"
        ],
        "Rodney": [
          "Wellsford",
          "Tauhoa",
          "Taupaki",
          "Tapora",
          "Whangateau",
          "Makarau",
          "Snells Beach",
          "Woodhill Forest",
          "Point Wells",
          "Parakai",
          "Sandspit",
          "Silverdale",
          "Matakatia",
          "Kumeu",
          "Tawharanui Peninsula",
          "Red Beach",
          "Helensville",
          "Albany Heights",
          "Leigh",
          "Tindalls Beach",
          "Waimauku",
          "Dairy Flat",
          "Tomarata",
          "Coatesville",
          "Manly",
          "Hatfields Beach",
          "Te Arai",
          "Wharehine",
          "Algies Bay",
          "Ti Point",
          "Kaukapakapa",
          "Mahurangi West",
          "Stanmore Bay",
          "Redvale",
          "Waitoki",
          "Pakiri",
          "Riverhead",
          "Port Albert",
          "Muriwai",
          "Army Bay",
          "Stillwater",
          "Wayby Valley",
          "Omaha",
          "Wainui",
          "Orewa",
          "Waiwera",
          "Whangaripo",
          "Te Hana",
          "Mahurangi East",
          "Gulf Harbour",
          "Puhoi",
          "Arkles Bay",
          "Rodney Surrounds",
          "Hibiscus Coast Surrounds",
          "Matakana",
          "Kaipara Flats",
          "Warkworth",
          "South Head",
          "Whangaparaoa",
          "Huapai",
          "Shelly Beach",
          "Millwater"
        ],
        "Franklin": [
          "Mauku",
          "Te Kohanga",
          "Onewhero",
          "Bombay",
          "Tuakau",
          "Aka Aka",
          "Mangatangi",
          "Whakatiwai",
          "Ararimu",
          "Kingseat",
          "Kaiaua",
          "Clarks Beach",
          "Pukekohe",
          "Mercer",
          "Puni",
          "Hunua",
          "Pollok",
          "Miranda",
          "Ramarama",
          "Manukau Heads",
          "Awhitu",
          "Patumahoe",
          "Paerata",
          "Pukekawa",
          "Waiau Pa",
          "Buckland",
          "Glenbrook",
          "Pokeno",
          "Otaua",
          "Mangatawhiri",
          "Pukekohe East",
          "Karaka",
          "Waiuku",
          "Whangape",
          "Port Waikato",
          "Glen Murray"
        ],
        "Waiheke Island": [
          "Surfdale",
          "Palm Beach",
          "Waiheke Island",
          "Onetangi",
          "Ostend",
          "Oneroa",
          "Omiha"
        ]
      }
    },
    "Waikato": {
      "hotSearch": [
        {
          "en": "Hamilton City",
          "cn": "Hamilton City"
        },
        {
          "en": "Waikato",
          "cn": "Waikato"
        },
        {
          "en": "Waipa",
          "cn": "Waipa"
        },
        {
          "en": "Matamata-Piako",
          "cn": "Matamata-Piako"
        }
      ],
      "city": [
        "Hamilton City",
        "Waikato",
        "Waipa",
        "Matamata-Piako",
        "Waitomo",
        "South Waikato",
        "Otorohanga",
        "Hauraki"
      ],
      "school": {
        "Hamilton City": [

        ],
        "Waikato": [

        ],
        "Waipa": [

        ],
        "Matamata-Piako": [

        ],
        "Waitomo": [

        ],
        "South Waikato": [

        ],
        "Otorohanga": [

        ],
        "Hauraki": [

        ]
      },
      "suburb": {
        "Hamilton City": [
          "Te Rapa Park",
          "Glenview",
          "Chartwell",
          "Enderley",
          "Claudelands",
          "Temple View",
          "Huntington",
          "Rototuna",
          "Queenwood",
          "Harrowfield",
          "Northgate",
          "Maeroa",
          "Melville",
          "Hamilton Lake",
          "Hamilton East",
          "Deanwell",
          "Avalon",
          "Baverstock",
          "Whitiora",
          "Dinsdale",
          "Fairfield",
          "Burbush",
          "Flagstaff",
          "Rototuna North",
          "Western Heights",
          "Frankton",
          "Te Rapa",
          "Pukete",
          "Riverlea",
          "Grandview Heights",
          "Bader",
          "Beerescourt",
          "Chedworth",
          "Nawton",
          "Fairview Downs",
          "Silverdale",
          "Ruakura",
          "Forest Lake",
          "Fitzroy",
          "Hillcrest",
          "Saint Andrews",
          "Hamilton Surrounds",
          "Hamilton Central"
        ],
        "Waikato": [
          "Horotiu",
          "Te Kowhai",
          "Meremere",
          "Gordonton",
          "Ngaruawahia",
          "Newstead",
          "Ruawaro",
          "Orini",
          "Whitikahu",
          "Tauwhare",
          "Rotokauri",
          "Glen Massey",
          "Horsham Downs",
          "Whatawhata",
          "Te Hoe",
          "Tamahere",
          "Eureka",
          "Taupiri",
          "Churchill",
          "Puketaha",
          "Rangiriri West",
          "Rangiriri",
          "Hampton Downs",
          "Waerenga",
          "Pukemoremore",
          "Waiterimu",
          "Rotongaro",
          "Waikato Surrounds",
          "Huntly",
          "Raglan",
          "Te Akau",
          "Te Kauwhata",
          "Maramarua",
          "Matangi"
        ],
        "Waipa": [
          "Leamington",
          "Tokanui",
          "Rukuhia",
          "Rotoorangi",
          "Kihikihi",
          "Te Miro",
          "Ngahinapouri",
          "Ohaupo",
          "Pirongia",
          "Cambridge",
          "Te Pahu",
          "Te Awamutu",
          "Wharepapa South",
          "Waipa Surrounds",
          "Karapiro",
          "Pukeatua",
          "Kaipaki"
        ],
        "Matamata-Piako": [
          "Richmond Downs",
          "Wardville",
          "Waharoa",
          "Te Poi",
          "Manawaru",
          "Matamata",
          "Turangaomoana",
          "Okauia",
          "Gordon",
          "Ngarua",
          "Morrinsville",
          "Te Aroha",
          "Tahuna",
          "Waitoa",
          "Waihou"
        ],
        "Waitomo": [
          "Aria",
          "Mahoenui",
          "Awakino",
          "Piopio",
          "Te Kuiti",
          "Waitomo",
          "Benneydale",
          "Marokopa"
        ],
        "South Waikato": [
          "Kinleith",
          "Lichfield",
          "Tapapa",
          "South Waikato Surrounds",
          "Tirau",
          "Tokoroa",
          "Putaruru",
          "Arapuni"
        ],
        "Otorohanga": [
          "Taharoa",
          "Kawhia",
          "Otorohanga Surrounds",
          "Otorohanga",
          "Maihiihi",
          "Oparau"
        ],
        "Hauraki": [
          "Waihi",
          "Waitakaruru",
          "Karangahake",
          "Waikino",
          "Mangatarata",
          "Pipiroa",
          "Paeroa",
          "Kaihere",
          "Ngatea",
          "Hauraki Surrounds",
          "Turua",
          "Kerepehi"
        ]
      }
    },
    "Wellington": {
      "hotSearch": [
        {
          "en": "Wellington City",
          "cn": "惠灵顿城"
        },
        {
          "en": "Lower Hutt City",
          "cn": "Lower Hutt City"
        },
        {
          "en": "Kapiti Coast",
          "cn": "Kapiti Coast"
        },
        {
          "en": "Upper Hutt City",
          "cn": "Upper Hutt City"
        }
      ],
      "city": [
        "Wellington City",
        "Lower Hutt City",
        "Kapiti Coast",
        "Upper Hutt City",
        "Porirua City"
      ],
      "school": {
        "Wellington City": [
          {
            "name": "Newlands College",
            "id": "5840ea9d1cab461c20cf58e9"
          },
          {
            "name": "Onslow College",
            "id": "5840eaa21cab461c20cf5924"
          },
          {
            "name": "Wellington College",
            "id": "5840eae31cab461c20cf5c72"
          },
          {
            "name": "Wellington Girls' College",
            "id": "5840eae31cab461c20cf5c73"
          }
        ],
        "Lower Hutt City": [
          {
            "name": "St Oran's College",
            "id": "5840ea601cab461c20cf5607"
          }
        ],
        "Kapiti Coast": [

        ],
        "Upper Hutt City": [

        ],
        "Porirua City": [

        ]
      },
      "suburb": {
        "Wellington City": [
          "Paparangi",
          "Kaiwharawhara",
          "Kilbirnie",
          "Breaker Bay",
          "Te Aro",
          "Island Bay",
          "Strathmore Park",
          "Karori",
          "Wilton",
          "Churton Park",
          "Glenside",
          "Southgate",
          "Melrose",
          "Aro Valley",
          "Hataitai",
          "Broadmeadows",
          "Roseneath",
          "Mount Victoria",
          "Wadestown",
          "Wellington Central",
          "Kelburn",
          "Berhampore",
          "Houghton Bay",
          "Rongotai",
          "Kingston",
          "Khandallah",
          "Ngauranga",
          "Ngaio",
          "Johnsonville",
          "Seatoun",
          "Newtown",
          "Karaka Bays",
          "Vogeltown",
          "Oriental Bay",
          "Miramar",
          "Brooklyn",
          "Ohariu",
          "Maupuia",
          "Grenada Village",
          "Northland",
          "Grenada North",
          "Crofton Downs",
          "Horokiwi",
          "Mount Cook",
          "Mornington",
          "Highbury",
          "Owhiro Bay",
          "Lyall Bay",
          "Makara",
          "Thorndon",
          "Tawa",
          "Newlands"
        ],
        "Lower Hutt City": [
          "Gracefield",
          "Waiwhetu",
          "Harbour View",
          "Boulcott",
          "Seaview",
          "Sorrento Bay",
          "Epuni",
          "Lower Hutt",
          "Avalon",
          "Tirohanga",
          "Taita",
          "Korokoro",
          "Days Bay",
          "Haywards",
          "Fairfield",
          "Woburn",
          "Point Howard",
          "Lowry Bay",
          "Petone",
          "Waterloo",
          "Manor Park",
          "Stokes Valley",
          "Alicetown",
          "Belmont",
          "Kelson",
          "Maungaraki",
          "Naenae",
          "Moera",
          "York Bay",
          "Normandale",
          "Melling",
          "Central Hutt",
          "Mahina Bay",
          "Eastbourne",
          "Pencarrow Head",
          "Wainuiomata",
          "Hutt Valley Surrounds"
        ],
        "Kapiti Coast": [
          "Paraparaumu Beach",
          "Waikanae Beach",
          "Raumati Beach",
          "Otaki Beach",
          "Otaihanga",
          "Peka Peka",
          "Kapiti Coast Surrounds",
          "Waikanae",
          "Te Horo",
          "Raumati South",
          "Paraparaumu",
          "Paekakariki",
          "Otaki"
        ],
        "Upper Hutt City": [
          "Clouston Park",
          "Birchville",
          "Blue Mountains",
          "Mangaroa",
          "Totara Park",
          "Maymorn",
          "Te Marua",
          "Rimutaka Hill",
          "Heretaunga",
          "Trentham",
          "Brown Owl",
          "Elderslea",
          "Pakuratahi",
          "Maoribank",
          "Silverstream",
          "Whitemans Valley",
          "Timberlea",
          "Riverstone Terraces",
          "Craigs Flat",
          "Pinehaven",
          "Moonshine Valley",
          "Wallaceville",
          "Ebdentown",
          "Kingsley Heights",
          "Akatarawa",
          "Upper Hutt",
          "Upper Hutt Surrounds",
          "Kaitoke",
          "Mount Marua"
        ],
        "Porirua City": [
          "Papakowhai",
          "Pukerua Bay",
          "Plimmerton",
          "Elsdon",
          "Judgeford",
          "Whitby",
          "Ascot Park",
          "Mana",
          "Porirua",
          "Camborne",
          "Cannons Creek",
          "Titahi Bay",
          "Paremata",
          "Waitangirua",
          "Pauatahanui",
          "Porirua East",
          "Aotea",
          "Ranui Heights",
          "Takapuwahia"
        ]
      }
    },
    "Hawkes Bay": {
      "hotSearch": [
        {
          "en": "Hastings",
          "cn": "Hastings"
        },
        {
          "en": "Napier City",
          "cn": "Napier City"
        },
        {
          "en": "Central Hawkes Bay",
          "cn": "Central Hawkes Bay"
        },
        {
          "en": "Wairoa",
          "cn": "Wairoa"
        }
      ],
      "city": [
        "Hastings",
        "Napier City",
        "Central Hawkes Bay",
        "Wairoa"
      ],
      "school": {
        "Hastings": [

        ],
        "Napier City": [

        ],
        "Central Hawkes Bay": [

        ],
        "Wairoa": [

        ]
      },
      "suburb": {
        "Hastings": [
          "Fernhill",
          "Raureka",
          "Camberley",
          "Haumoana",
          "Woolwich",
          "Frimley",
          "Bridge Pa",
          "Omahu",
          "Saint Leonards",
          "Kuripapango",
          "Dartmoor",
          "Karamu",
          "Pakowhai",
          "Flaxmere",
          "Hastings",
          "Otamauri",
          "Pakipaki",
          "Whakatu",
          "Waiwhare",
          "Parkvale",
          "Roys Hill",
          "Tomoana",
          "Mayfair",
          "Mahora",
          "Sherenden",
          "Clive",
          "Tangoio",
          "Crownthorpe",
          "Whanawhana",
          "Longlands",
          "Akina",
          "Mangateretere",
          "Twyford",
          "Waipatu",
          "Hastings Country",
          "Te Haroto",
          "Tutira",
          "Eskdale",
          "Puketitiri",
          "Te Awanga",
          "Havelock North",
          "Waimarama",
          "Poukawa",
          "Maraekakaho",
          "Puketapu",
          "Hawkes Bay Area"
        ],
        "Napier City": [
          "Tamatea",
          "Pandora",
          "Awatoto",
          "Pirimai",
          "Greenmeadows",
          "Napier Port",
          "Jervoistown",
          "Meeanee",
          "Taradale",
          "Bay View",
          "Ahuriri",
          "Marewa",
          "Te Awa",
          "Onekawa",
          "Maraenui",
          "Napier City Surrounds",
          "Napier Hill",
          "Westshore",
          "Napier Central",
          "Poraiti",
          "Napier South"
        ],
        "Central Hawkes Bay": [
          "Porangahau",
          "Waipawa",
          "Mangaorapa",
          "Ormondville",
          "Central Hawkes Bay Coastal",
          "Central Hawkes Bay Country",
          "Elsthorpe",
          "Otane",
          "Waipukurau and Surrounds",
          "Ongaonga",
          "Takapau",
          "Tikokino"
        ],
        "Wairoa": [
          "Mahia",
          "Ruakituri",
          "Raupunga",
          "Wairoa Country",
          "Nuhaka/Morere",
          "Wairoa",
          "Tuai/Ohuka",
          "Kotemaori"
        ]
      }
    },
    "Taranaki": {
      "hotSearch": [
        {
          "en": "New Plymouth",
          "cn": "New Plymouth"
        },
        {
          "en": "South Taranaki",
          "cn": "South Taranaki"
        },
        {
          "en": "Stratford",
          "cn": "Stratford"
        }
      ],
      "city": [
        "New Plymouth",
        "South Taranaki",
        "Stratford"
      ],
      "school": {
        "New Plymouth": [

        ],
        "South Taranaki": [

        ],
        "Stratford": [

        ]
      },
      "suburb": {
        "New Plymouth": [
          "Whalers Gate",
          "New Plymouth Central",
          "Tikorangi",
          "Hurdon",
          "Blagdon",
          "Glen Avon",
          "Ferndale",
          "Marfell",
          "Okoki",
          "Strandon",
          "Motumahanga (Saddleback)",
          "Mokau",
          "Highlands Park",
          "Welbourn",
          "Merrilands",
          "Lynmouth",
          "Brooklands",
          "Fitzroy",
          "Westown",
          "Omata",
          "Spotswood",
          "Tarurutangi",
          "New Plymouth Area Surrounds",
          "New Plymouth Coastal",
          "New Plymouth City Surrounds",
          "Tongaporutu",
          "Uruti",
          "Waitara",
          "Urenui",
          "Bell Block",
          "Hillsborough",
          "Vogeltown",
          "Okato",
          "Oakura",
          "Inglewood",
          "Tarata",
          "Lepperton",
          "Egmont Village",
          "Hurworth",
          "Frankleigh Park",
          "Moturoa",
          "Mangorei",
          "Korito",
          "Onaero",
          "Waiwhakaiho"
        ],
        "South Taranaki": [
          "Ohangai",
          "Waverley",
          "South Taranaki Surrounds",
          "Waitotara",
          "Patea",
          "Manutahi",
          "Hawera",
          "Eltham",
          "Opunake",
          "Manaia",
          "Rahotu",
          "Okaiawa",
          "Matemateaonga",
          "Normanby",
          "Kaponga"
        ],
        "Stratford": [
          "Stratford Surrounds",
          "Stratford",
          "Douglas",
          "Tahora",
          "Pohokura and Surrounds",
          "Midhirst"
        ]
      }
    }
  },
  //list页面area数据
  citys: {
    "city": [
      "Auckland City",
      "Franklin",
      "Hauraki Gulf Islands",
      "Manukau City",
      "North Shore City",
      "Papakura",
      "Rodney",
      "Waiheke Island",
      "Waitakere City"
    ],
    "suburb": {
      "Franklin": [
        "Aka Aka",
        "Ararimu",
        "Awhitu",
        "Bombay",
        "Buckland",
        "Clarks Beach",
        "Glen Murray",
        "Glenbrook",
        "Hunua",
        "Kaiaua",
        "Karaka",
        "Kingseat",
        "Mangatangi",
        "Mangatawhiri",
        "Manukau Heads",
        "Mauku",
        "Mercer",
        "Miranda",
        "Onewhero",
        "Otaua",
        "Paerata",
        "Patumahoe",
        "Pokeno",
        "Pollok",
        "Port Waikato",
        "Pukekawa",
        "Pukekohe",
        "Pukekohe East",
        "Puni",
        "Ramarama",
        "Te Kohanga",
        "Tuakau",
        "Waiau Pa",
        "Waiuku",
        "Whakatiwai",
        "Whangape"
      ],
      "North Shore City": [
        "Albany",
        "Bayswater",
        "Bayview",
        "Beach Haven",
        "Belmont",
        "Birkdale",
        "Birkenhead",
        "Browns Bay",
        "Campbells Bay",
        "Castor Bay",
        "Chatswood",
        "Devonport",
        "Fairview Heights",
        "Forrest Hill",
        "Glenfield",
        "Greenhithe",
        "Hauraki",
        "Hillcrest",
        "Long Bay",
        "Lucas Heights",
        "Mairangi Bay",
        "Milford",
        "Murrays Bay",
        "Narrow Neck",
        "Northcote",
        "Northcote Point",
        "Northcross",
        "Okura",
        "Oteha",
        "Paremoremo",
        "Pinehill",
        "Rosedale",
        "Rothesay Bay",
        "Schnapper Rock",
        "Stanley Point",
        "Sunnynook",
        "Takapuna",
        "Torbay",
        "Totara Vale",
        "Unsworth Heights",
        "Waiake",
        "Wairau Valley",
        "Windsor Park"
      ],
      "Rodney": [
        "Albany Heights",
        "Algies Bay",
        "Arkles Bay",
        "Army Bay",
        "Coatesville",
        "Dairy Flat",
        "Gulf Harbour",
        "Hatfields Beach",
        "Helensville",
        "Hibiscus Coast Surrounds",
        "Huapai",
        "Kaipara Flats",
        "Kaukapakapa",
        "Kumeu",
        "Leigh",
        "Mahurangi East",
        "Mahurangi West",
        "Makarau",
        "Manly",
        "Matakana",
        "Matakatia",
        "Millwater",
        "Muriwai",
        "Omaha",
        "Orewa",
        "Pakiri",
        "Parakai",
        "Point Wells",
        "Port Albert",
        "Puhoi",
        "Red Beach",
        "Redvale",
        "Riverhead",
        "Rodney Surrounds",
        "Sandspit",
        "Shelly Beach",
        "Silverdale",
        "Snells Beach",
        "South Head",
        "Stanmore Bay",
        "Stillwater",
        "Tapora",
        "Tauhoa",
        "Taupaki",
        "Tawharanui Peninsula",
        "Te Arai",
        "Te Hana",
        "Ti Point",
        "Tindalls Beach",
        "Tomarata",
        "Waimauku",
        "Wainui",
        "Waitoki",
        "Waiwera",
        "Warkworth",
        "Wayby Valley",
        "Wellsford",
        "Whangaparaoa",
        "Whangaripo",
        "Whangateau",
        "Wharehine",
        "Woodhill Forest"
      ],
      "Hauraki Gulf Islands": [
        "Great Barrier Island",
        "Kawau Island",
        "Other Islands",
        "Rakino Island"
      ],
      "Manukau City": [
        "Alfriston",
        "Auckland Airport",
        "Beachlands",
        "Botany Downs",
        "Brookby",
        "Bucklands Beach",
        "Burswood",
        "Clendon Park",
        "Clevedon",
        "Clover Park",
        "Cockle Bay",
        "Dannemora",
        "East Tamaki",
        "East Tamaki Heights",
        "Eastern Beach",
        "Farm Cove",
        "Favona",
        "Flat Bush",
        "Golflands",
        "Goodwood Heights",
        "Half Moon Bay",
        "Highland Park",
        "Hillpark",
        "Howick",
        "Huntington Park",
        "Kawakawa Bay",
        "Mangere",
        "Mangere Bridge",
        "Mangere East",
        "Manukau",
        "Manukau Heights",
        "Manurewa",
        "Manurewa East",
        "Maraetai",
        "Mellons Bay",
        "Middlemore Hospital",
        "Mission Heights",
        "Ness Valley",
        "Northpark",
        "Orere Point",
        "Otara",
        "Pakuranga",
        "Pakuranga Heights",
        "Papatoetoe",
        "Randwick Park",
        "Shamrock Park",
        "Shelly Park",
        "Somerville",
        "Sunnyhills",
        "The Gardens",
        "Totara Heights",
        "Totara Park",
        "Wattle Downs",
        "Weymouth",
        "Whitford",
        "Wiri"
      ],
      "Waitakere City": [
        "Bethells Beach",
        "Cornwallis",
        "Glen Eden",
        "Glendene",
        "Green Bay",
        "Henderson",
        "Henderson Valley",
        "Herald Island",
        "Hobsonville",
        "Huia",
        "Karekare",
        "Kelston",
        "Laingholm",
        "Massey",
        "New Lynn",
        "Oratia",
        "Parau",
        "Piha",
        "Ranui",
        "Sunnyvale",
        "Swanson",
        "Te Atatu Peninsula",
        "Te Atatu South",
        "Titirangi",
        "Waiatarua",
        "Waitakere",
        "West Harbour",
        "Westgate",
        "Whenuapai"
      ],
      "Papakura": [
        "Ardmore",
        "Conifer Grove",
        "Drury",
        "Hingaia",
        "Opaheke",
        "Pahurehure",
        "Papakura",
        "Red Hill",
        "Rosehill",
        "Runciman",
        "Takanini"
      ],
      "Auckland City": [
        "Auckland Central",
        "Avondale",
        "Blockhouse Bay",
        "Eden Terrace",
        "Ellerslie",
        "Epsom",
        "Freemans Bay",
        "Glen Innes",
        "Glendowie",
        "Grafton",
        "Greenlane",
        "Grey Lynn",
        "Herne Bay",
        "Hillsborough",
        "Kingsland",
        "Kohimarama",
        "Lynfield",
        "Meadowbank",
        "Mission Bay",
        "Morningside",
        "Mount Albert",
        "Mount Eden",
        "Mount Roskill",
        "Mount Wellington",
        "New Windsor",
        "Newmarket",
        "Newton",
        "One Tree Hill",
        "Onehunga",
        "Orakei",
        "Otahuhu",
        "Panmure",
        "Parnell",
        "Penrose",
        "Point Chevalier",
        "Point England",
        "Ponsonby",
        "Remuera",
        "Royal Oak",
        "Saint Heliers",
        "Saint Johns",
        "Saint Marys Bay",
        "Sandringham",
        "Stonefields",
        "Three Kings",
        "Waiotaiki Bay",
        "Waterview",
        "Western Springs",
        "Westmere"
      ],
      "Waiheke Island": [
        "Omiha",
        "Oneroa",
        "Onetangi",
        "Ostend",
        "Palm Beach",
        "Surfdale",
        "Waiheke Island"
      ]
    }
  },
  //list页面school数据
  schoolObj: {
    "Franklin": [

    ],
    "North Shore City": [{
      "name": "Rangitoto College",
      "id": "5840ea5a1cab461c20cf55c8"
    },
    {
      "name": "Albany Senior High School",
      "id": "5840ea661cab461c20cf5630"
    },
    {
      "name": "Long Bay College",
      "id": "5840ea8f1cab461c20cf5836"
    },
    {
      "name": "Takapuna Grammar School",
      "id": "5840eac81cab461c20cf5aff"
    },
    {
      "name": "Westlake Boys' High School",
      "id": "5840eae51cab461c20cf5c80"
    },
    {
      "name": "Westlake Girls' High School",
      "id": "5840eae51cab461c20cf5c81"
    }
    ],
    "Rodney": [

    ],
    "Hauraki Gulf Islands": [

    ],
    "Manukau City": [{
      "name": "Botany Downs Secondary College",
      "id": "5840ea1d1cab461c20cf52d0"
    },
    {
      "name": "Macleans College",
      "id": "5840ea901cab461c20cf583f"
    }
    ],
    "Waitakere City": [{
      "name": "Hobsonville Point Secondary School",
      "id": "5840ea771cab461c20cf56f8"
    }],
    "Papakura": [

    ],
    "Auckland City": [{
      "name": "Epsom Girls Grammar School",
      "id": "5840ea281cab461c20cf5355"
    },
    {
      "name": "Glendowie College",
      "id": "5840ea371cab461c20cf5405"
    },
    {
      "name": "Auckland Grammar",
      "id": "5840ea661cab461c20cf5633"
    }
    ],
    "Waiheke Island": [

    ]
  },
  //判断语言
  // detectedLng: (getCurrentPages()[getCurrentPages().length - 1]).route,
  //请求头函数
  aca: function () {
    var b = Math.floor(Math.random() * 10);
    return Math.floor(Math.random() * 89 + 10) + Date.parse(new Date()).toString().substr(2) + b.toString() + (9 - b) + Math.floor(Math.random() * 899 + 100);
  },
  //get请求
  getData: function (obj) {
    wx.request({
      url: obj.url,
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Coding': factory.aca()
      },
      success: function (res) {
        if (res.data.isOK) {
          obj.callBack(res);
        }
      }
    })
  },
  //ajax请求post方法
  postData: function (obj) {
      wx.request({
        url: obj.url,
        method: 'POST',
        dataType: 'json',
        data: obj.data,
        header: {
          'content-type': 'application/json;charset=utf-8',
          'Accept-Coding': factory.aca()
        },
        success: function (res) {
          if (res.data.isOK) {
            obj.callBack(res.data);
          }
        }
      })
  },
  //数组去重
  unique: function (arr, page) {
    var res = [];
    var obj = {};
    if (page) {
      for (var i = 0; i < arr.length; i++) {
        if (!obj[(arr[i]).name]) {
          res.push((arr[i]));
          obj[(arr[i]).name] = 1;
        }
      }
    } else {
      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]._id]) {
          res.push(arr[i]);
          obj[arr[i]._id] = 1;
        }
      }
    }
    return res;
  },
  //数字格式化,每三位一个逗号
  numFormat: function (num) {
    var result = [],
      counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
      counter++;
      result.unshift(num[i]);
      if (!(counter % 3) && i != 0) {
        result.unshift(',')
      };
    }
    return result.join('');
  },
  //将时间戳转化为日期
  timeFormat: function (t, hourShow) {
    if (!t) {
      t = 1401552000000;
    } else {
      t = t / 1;
    }
    var timeNow = new Date(t);
    var y = timeNow.getFullYear();
    var m = timeNow.getMonth() + 1;
    var d = timeNow.getDate();
    var h = timeNow.getHours() % 12;
    var ap = (timeNow.getHours() / 12) > 1 ? 'PM' : 'AM';
    var min = timeNow.getMinutes() < 10 ? ('0' + timeNow.getMinutes()) : timeNow.getMinutes();
    var str = hourShow ? (y + '/' + m + '/' + d + '   ' + h + ':' + min + ' ' + ap) : y + '/' + m + '/' + d;
    return str;
  },
  //冒泡排序
  sort: function (arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var q = 0; q < arr.length - i - 1; q++) {
        if (arr[q].rank > arr[q + 1].rank) {
          var temp = arr[q];
          arr[q] = arr[q + 1];
          arr[q + 1] = temp;
        }
      }
    }
    return arr;
  },
  //设置学校分数打印星星函数
  setStar: function (obj) {
    switch (Math.ceil(obj.decile / 2)) {
      case 0:
        obj.yellowStar = [];
        obj.grayStar = [1, 2, 3, 4, 5];
        break;
      case 1:
        obj.yellowStar = [1];
        obj.grayStar = [1, 2, 3, 4];
        break;
      case 2:
        obj.yellowStar = [1, 2];
        obj.grayStar = [1, 2, 3];
        break;
      case 3:
        obj.yellowStar = [1, 2, 3];
        obj.grayStar = [1, 2];
        break;
      case 4:
        obj.yellowStar = [1, 2, 3, 4];
        obj.grayStar = [1];
        break;
      case 5:
        obj.yellowStar = [1, 2, 3, 4, 5];
        obj.grayStar = [];
        break;
    }
  },


}


module.exports.factory = factory
import React, { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as XLSX from "xlsx";
import {
  Alert,
  Animated,
  AppState,
  BackHandler,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "DAILYTASK_LOCAL_STORAGE_V1";

const demoUser = {
  id: "u1",
  fullName: "Admin",
  employeeId: "",
  username: "admin",
  password: "admin123",
  role: "Local User",
  designation: "",
  department: "",
  phone: "",
  email: "",
  profilePhotoUri: "",
  profileSetupCompleted: false,
};

const DEFAULT_COMPANY_BRANCHES = {
  QSR: ["PANDA", "KORYO", "UMAMI", "CPR"],
  DTF: ["MOE-DTF", "TDM-DTF", "AUH-DTF", "NKL-DTF", "BW-DTF"],
  HSF: ["HSF"],
  REINS: ["GYU KAKU", "GYU BOSS"],
};

const DEFAULT_BC_BRANCH_CODES = [
  {
    "id": "bc-bb-ajm",
    "entity": "BB",
    "code": "BB-AJM",
    "name": "BAMBOO BISTRO-Al Jimi Mall – Al Ain"
  },
  {
    "id": "bc-bb-aka",
    "entity": "BB",
    "code": "BB-AKA",
    "name": "Bamboo Bistro-Al Khail Avenue – Dubai"
  },
  {
    "id": "bc-bb-brand",
    "entity": "BB",
    "code": "BB-BRAND",
    "name": "BAMBOO BISTRO Brand"
  },
  {
    "id": "bc-bb-ck",
    "entity": "BB",
    "code": "BB-CK",
    "name": "BAMBOO BISTRO Central Kitchen – Dubai"
  },
  {
    "id": "bc-bbkf-brand",
    "entity": "BBKF",
    "code": "BBKF-BRAND",
    "name": "Bamboo Banquet Kitchen - Brand"
  },
  {
    "id": "bc-bbkf-sk",
    "entity": "BBKF",
    "code": "BBKF-SK",
    "name": "Bamboo Banquet Kitchen - Selling kitchen"
  },
  {
    "id": "bc-bb-sup",
    "entity": "BB",
    "code": "BB-SUP",
    "name": "BAMBOO BISTRO Supplies"
  },
  {
    "id": "bc-bb-wh",
    "entity": "BB",
    "code": "BB-WH",
    "name": "BAMBOO BISTRO Warehouse – Dubai"
  },
  {
    "id": "bc-cpr-agc",
    "entity": "CPR",
    "code": "CPR-AGC",
    "name": "Chinese Palace AL Ghurair Centre"
  },
  {
    "id": "bc-cpr-arab",
    "entity": "CPR",
    "code": "CPR-ARAB",
    "name": "Chinese Palace Arabian Centre"
  },
  {
    "id": "bc-cpr-auhck",
    "entity": "CPR",
    "code": "CPR-AUHCK",
    "name": "Chinese Palace Khalifa City Cloud Kitchen"
  },
  {
    "id": "bc-cpr-bjc",
    "entity": "CPR",
    "code": "CPR-BJC",
    "name": "Chinese Palace Burjuman Centre"
  },
  {
    "id": "bc-cpr-brand",
    "entity": "CPR",
    "code": "CPR-BRAND",
    "name": "Chinese Palace BRAND"
  },
  {
    "id": "bc-cpr-ck",
    "entity": "CPR",
    "code": "CPR-CK",
    "name": "Chinese Palace Central Kitchen – Dubai"
  },
  {
    "id": "bc-cpr-dfc",
    "entity": "CPR",
    "code": "CPR-DFC",
    "name": "Chinese Palace Dubai Festival City"
  },
  {
    "id": "bc-cpr-group",
    "entity": "CPR",
    "code": "CPR-GROUP",
    "name": "Chinese Palace Group"
  },
  {
    "id": "bc-cpr-ibn",
    "entity": "CPR",
    "code": "CPR-IBN",
    "name": "Chinese Palace IBN Battuta Mall"
  },
  {
    "id": "bc-cpr-ladym",
    "entity": "CPR",
    "code": "CPR-LADYM",
    "name": "Lady M Restaurant & Cafe LLC – Dubai"
  },
  {
    "id": "bc-cpr-mcc",
    "entity": "CPR",
    "code": "CPR-MCC",
    "name": "Chinese Palace Mirdif City Centre"
  },
  {
    "id": "bc-cpr-moe",
    "entity": "CPR",
    "code": "CPR-MOE",
    "name": "Chinese Palace Mall of Emirates"
  },
  {
    "id": "bc-cpr-mtcck",
    "entity": "CPR",
    "code": "CPR-MTCCK",
    "name": "Chinese Palace Motor City Cloud Kitchen"
  },
  {
    "id": "bc-cpr-nkm",
    "entity": "CPR",
    "code": "CPR-NKM",
    "name": "Chinese Palace Nakheel Mall"
  },
  {
    "id": "bc-cpr-reem",
    "entity": "CPR",
    "code": "CPR-REEM",
    "name": "Chinese Palace Reem Mall"
  },
  {
    "id": "bc-cpr-sc",
    "entity": "CPR",
    "code": "CPR-SC",
    "name": "Chinese Palace Silicon Central Mall"
  },
  {
    "id": "bc-cpr-sup",
    "entity": "CPR",
    "code": "CPR-SUP",
    "name": "Chinese Palace Supplies"
  },
  {
    "id": "bc-cpr-tdm",
    "entity": "CPR",
    "code": "CPR-TDM",
    "name": "Chinese Palace The Dubai Mall"
  },
  {
    "id": "bc-cpr-wh",
    "entity": "CPR",
    "code": "CPR-WH",
    "name": "Chinese Palace Warehouse – Dubai"
  },
  {
    "id": "bc-dip-wh",
    "entity": "DIP",
    "code": "DIP-WH",
    "name": "Din Tai Fung Warehouse – Dubai"
  },
  {
    "id": "bc-dtf-agc",
    "entity": "DTF",
    "code": "DTF-AGC",
    "name": "Din Tai Fung AL Ghurair Centre"
  },
  {
    "id": "bc-dtf-arj",
    "entity": "DTF",
    "code": "DTF-ARJ",
    "name": "Din Tai Fung Arjan"
  },
  {
    "id": "bc-dtf-auck",
    "entity": "DTF",
    "code": "DTF-AUCK",
    "name": "Din Tai Fung Khalifa City Cloud Kitchen"
  },
  {
    "id": "bc-dtf-brand",
    "entity": "DTF",
    "code": "DTF-BRAND",
    "name": "Din Tai Fung Brand"
  },
  {
    "id": "bc-dtf-bwi",
    "entity": "DTF",
    "code": "DTF-BWI",
    "name": "Din Tai Fung Bluewaters Island"
  },
  {
    "id": "bc-dtf-ck",
    "entity": "DTF",
    "code": "DTF-CK",
    "name": "Din Tai Fung Central Kitchen – Dubai"
  },
  {
    "id": "bc-dtf-dfc",
    "entity": "DTF",
    "code": "DTF-DFC",
    "name": "Din Tai Fung Dubai Dubai Festival City"
  },
  {
    "id": "bc-dtf-dhm",
    "entity": "DTF",
    "code": "DTF-DHM",
    "name": "Din Tai Fung Dubai Hills Mall"
  },
  {
    "id": "bc-dtf-gal",
    "entity": "DTF",
    "code": "DTF-GAL",
    "name": "Din Tai Fung Galleria Mall"
  },
  {
    "id": "bc-dtf-moe",
    "entity": "DTF",
    "code": "DTF-MOE",
    "name": "Din Tai Fung Mall of Emirates"
  },
  {
    "id": "bc-dtf-mtck",
    "entity": "DTF",
    "code": "DTF-MTCK",
    "name": "Din Tai Fung Motor City Cloud Kitchen"
  },
  {
    "id": "bc-dtf-nkm",
    "entity": "DTF",
    "code": "DTF-NKM",
    "name": "Din Tai Fung Nakheel Mall"
  },
  {
    "id": "bc-dtf-sc",
    "entity": "DTF",
    "code": "DTF-SC",
    "name": "Din Tai Fung Silicon Central Cloud Kitchen"
  },
  {
    "id": "bc-dtf-sup",
    "entity": "DTF",
    "code": "DTF-SUP",
    "name": "Din Tai Fung Supplies"
  },
  {
    "id": "bc-dtf-tdm",
    "entity": "DTF",
    "code": "DTF-TDM",
    "name": "Din Tai Fung The Dubai Mall"
  },
  {
    "id": "bc-dtf-yas",
    "entity": "DTF",
    "code": "DTF-YAS",
    "name": "Din Tai Fung Yas Mall – Abu Dhabi"
  },
  {
    "id": "bc-dtf-zahia",
    "entity": "DTF",
    "code": "DTF-ZAHIA",
    "name": "Din Tai Fung Dubai Al Zahia"
  },
  {
    "id": "bc-hsf-brand",
    "entity": "HSF",
    "code": "HSF-BRAND",
    "name": "Han Shi Fu Brand"
  },
  {
    "id": "bc-hsf-ck",
    "entity": "HSF",
    "code": "HSF-CK",
    "name": "Han Shi Fu Central Kitchen"
  },
  {
    "id": "bc-hsf-dcc",
    "entity": "HSF",
    "code": "HSF-DCC",
    "name": "Han Shi Fu Deira City Centre – Dubai"
  },
  {
    "id": "bc-hsf-jlt",
    "entity": "HSF",
    "code": "HSF-JLT",
    "name": "Han Shi Fu Restaurant (FZ Branch)"
  },
  {
    "id": "bc-hsf-sup",
    "entity": "HSF",
    "code": "HSF-SUP",
    "name": "Han Shi Fu Supplies"
  },
  {
    "id": "bc-hsf-wh",
    "entity": "HSF",
    "code": "HSF-WH",
    "name": "Han Shi Fu Warehouse – Dubai"
  },
  {
    "id": "bc-imr-brand",
    "entity": "IMR",
    "code": "IMR-BRAND",
    "name": "INTERMISSION RESTAURANT Brand"
  },
  {
    "id": "bc-imr-ck",
    "entity": "IMR",
    "code": "IMR-CK",
    "name": "INTERMISSION RESTAURANT Central Kitchen – Dubai"
  },
  {
    "id": "bc-imr-moe",
    "entity": "IMR",
    "code": "IMR-MOE",
    "name": "INTERMISSION RESTAURANT - Mall of the emirates"
  },
  {
    "id": "bc-imr-sup",
    "entity": "IMR",
    "code": "IMR-SUP",
    "name": "INTERMISSION RESTAURANT Supplies"
  },
  {
    "id": "bc-imr-wh",
    "entity": "IMR",
    "code": "IMR-WH",
    "name": "INTERMISSION RESTAURANT Warehouse"
  },
  {
    "id": "bc-intransit",
    "entity": "INTRANSIT",
    "code": "INTRANSIT",
    "name": "Intransit"
  },
  {
    "id": "bc-kory-brand",
    "entity": "KORY",
    "code": "KORY-BRAND",
    "name": "Koryo Restaurant BRAND"
  },
  {
    "id": "bc-koryo-auck",
    "entity": "KORYO",
    "code": "KORYO-AUCK",
    "name": "Koryo Khalifa City Cloud Kitchen"
  },
  {
    "id": "bc-koryo-bjc",
    "entity": "KORYO",
    "code": "KORYO-BJC",
    "name": "Koryo Burjuman Centre"
  },
  {
    "id": "bc-koryo-ck",
    "entity": "KORYO",
    "code": "KORYO-CK",
    "name": "Koryo Central Kitchen"
  },
  {
    "id": "bc-koryo-ibn",
    "entity": "KORYO",
    "code": "KORYO-IBN",
    "name": "Koryo IBN Battuta Mall"
  },
  {
    "id": "bc-koryo-moe",
    "entity": "KORYO",
    "code": "KORYO-MOE",
    "name": "Koryo Mall of Emirates"
  },
  {
    "id": "bc-koryo-mtck",
    "entity": "KORYO",
    "code": "KORYO-MTCK",
    "name": "Koryo Motor City Cloud Kitchen – Dubai"
  },
  {
    "id": "bc-koryo-sup",
    "entity": "KORYO",
    "code": "KORYO-SUP",
    "name": "Koryo Supplies"
  },
  {
    "id": "bc-koryo-wh",
    "entity": "KORYO",
    "code": "KORYO-WH",
    "name": "Koryo Warehouse"
  },
  {
    "id": "bc-momo-brand",
    "entity": "MOMO",
    "code": "MOMO-BRAND",
    "name": "MOMOFUKU BRAND"
  },
  {
    "id": "bc-momo-ck",
    "entity": "MOMO",
    "code": "MOMO-CK",
    "name": "MOMOFUKU Central Kitchen"
  },
  {
    "id": "bc-momo-sg",
    "entity": "MOMO",
    "code": "MOMO-SG",
    "name": "MOMOFUKU - Saadiyat Grove"
  },
  {
    "id": "bc-momo-sup",
    "entity": "MOMO",
    "code": "MOMO-SUP",
    "name": "MOMOFUKU Supplies"
  },
  {
    "id": "bc-momo-wh",
    "entity": "MOMO",
    "code": "MOMO-WH",
    "name": "MOMOFUKU Warehouse – Dubai"
  },
  {
    "id": "bc-panda-acc",
    "entity": "PANDA",
    "code": "PANDA-ACC",
    "name": "Panda Chinese Ajman City Centre"
  },
  {
    "id": "bc-panda-auck",
    "entity": "PANDA",
    "code": "PANDA-AUCK",
    "name": "Panda Chinese Khalifa City Cloud Kitchen"
  },
  {
    "id": "bc-panda-azc",
    "entity": "PANDA",
    "code": "PANDA-AZC",
    "name": "PANDA CHINESE RESTAURANT-City Centre Al Zahia"
  },
  {
    "id": "bc-panda-ck",
    "entity": "PANDA",
    "code": "PANDA-CK",
    "name": "Panda Chinese Central Kitchen – Dubai"
  },
  {
    "id": "bc-panda-dcc",
    "entity": "PANDA",
    "code": "PANDA-DCC",
    "name": "Panda Chinese Deira City Centre"
  },
  {
    "id": "bc-panda-dhm",
    "entity": "PANDA",
    "code": "PANDA-DHM",
    "name": "Panda Chinese Dubai Hills Mall"
  },
  {
    "id": "bc-panda-dom",
    "entity": "PANDA",
    "code": "PANDA-DOM",
    "name": "Panda Chinese Dubai Outlet Mall"
  },
  {
    "id": "bc-panda-gal",
    "entity": "PANDA",
    "code": "PANDA-GAL",
    "name": "Panda Chinese Galleria Mall"
  },
  {
    "id": "bc-panda-mcck",
    "entity": "PANDA",
    "code": "PANDA-MCCK",
    "name": "Panda Chinese Motor City Cloud Kitchen"
  },
  {
    "id": "bc-panda-mm",
    "entity": "PANDA",
    "code": "PANDA-MM",
    "name": "Panda Chinese Marina Mall"
  },
  {
    "id": "bc-panda-scc",
    "entity": "PANDA",
    "code": "PANDA-SCC",
    "name": "PANDA CHINESE RESTAURANT- City Centre Sharjah"
  },
  {
    "id": "bc-panda-sup",
    "entity": "PANDA",
    "code": "PANDA-SUP",
    "name": "Panda Chinese Supplies"
  },
  {
    "id": "bc-panda-tdm",
    "entity": "PANDA",
    "code": "PANDA-TDM",
    "name": "Panda Chinese The Dubai Mall"
  },
  {
    "id": "bc-panda-wh",
    "entity": "PANDA",
    "code": "PANDA-WH",
    "name": "Panda Chinese Warehouse"
  },
  {
    "id": "bc-panda-yas",
    "entity": "PANDA",
    "code": "PANDA-YAS",
    "name": "Panda Chinese Yas Mall"
  },
  {
    "id": "bc-pand-brand",
    "entity": "PAND",
    "code": "PAND-BRAND",
    "name": "Panda Chinese Restaurant BRAND"
  },
  {
    "id": "bc-sp-ad",
    "entity": "SP",
    "code": "SP-AD",
    "name": "Summer Palace the Groove sadiath Island"
  },
  {
    "id": "bc-sp-brand",
    "entity": "SP",
    "code": "SP-BRAND",
    "name": "Summer Palace Brand"
  },
  {
    "id": "bc-sp-ck",
    "entity": "SP",
    "code": "SP-CK",
    "name": "Summer Palace Central Kitchen"
  },
  {
    "id": "bc-sp-sup",
    "entity": "SP",
    "code": "SP-SUP",
    "name": "Summer Palace Supplies"
  },
  {
    "id": "bc-sp-wh",
    "entity": "SP",
    "code": "SP-WH",
    "name": "Summer Palace Warehouse"
  },
  {
    "id": "bc-tdr-brand",
    "entity": "TDR",
    "code": "TDR-BRAND",
    "name": "The Dressing Room Brand"
  },
  {
    "id": "bc-tdr-ck",
    "entity": "TDR",
    "code": "TDR-CK",
    "name": "The Dressing Room Central Kitchen – Dubai"
  },
  {
    "id": "bc-tdr-moe",
    "entity": "TDR",
    "code": "TDR-MOE",
    "name": "The Dressing Room-Mall of the emirates"
  },
  {
    "id": "bc-tdr-sup",
    "entity": "TDR",
    "code": "TDR-SUP",
    "name": "Dressing Room Supplies"
  },
  {
    "id": "bc-tdr-wh",
    "entity": "TDR",
    "code": "TDR-WH",
    "name": "The Dressing Room Warehouse – Dubai"
  },
  {
    "id": "bc-tiger-ck",
    "entity": "TIGER",
    "code": "TIGER-CK",
    "name": "Tiger Sugar Central Kitchen – Dubai"
  },
  {
    "id": "bc-tiger-dcc",
    "entity": "TIGER",
    "code": "TIGER-DCC",
    "name": "Tiger Sugar Deira City Centre"
  },
  {
    "id": "bc-tiger-gal",
    "entity": "TIGER",
    "code": "TIGER-GAL",
    "name": "Tiger Sugar Galleria Mall"
  },
  {
    "id": "bc-tiger-moe",
    "entity": "TIGER",
    "code": "TIGER-MOE",
    "name": "Tiger Sugar Mall of Emirates"
  },
  {
    "id": "bc-tiger-nkm",
    "entity": "TIGER",
    "code": "TIGER-NKM",
    "name": "Tiger Sugar Nakheel Mall"
  },
  {
    "id": "bc-tiger-pop",
    "entity": "TIGER",
    "code": "TIGER-POP",
    "name": "Tiger Sugar-POP UP"
  },
  {
    "id": "bc-tiger-sup",
    "entity": "TIGER",
    "code": "TIGER-SUP",
    "name": "Tiger Sugar Supplies"
  },
  {
    "id": "bc-tiger-tdm",
    "entity": "TIGER",
    "code": "TIGER-TDM",
    "name": "Tiger Sugar The Dubai Mall"
  },
  {
    "id": "bc-tiger-wh",
    "entity": "TIGER",
    "code": "TIGER-WH",
    "name": "Tiger Sugar Warehouse – Dubai"
  },
  {
    "id": "bc-tiger-yas",
    "entity": "TIGER",
    "code": "TIGER-YAS",
    "name": "Tiger Sugar Yas Mall"
  },
  {
    "id": "bc-tigr-brand",
    "entity": "TIGR",
    "code": "TIGR-BRAND",
    "name": "Tiger Sugar Brand"
  },
  {
    "id": "bc-umam-brand",
    "entity": "UMAM",
    "code": "UMAM-BRAND",
    "name": "Umami Restaurant BRAND"
  },
  {
    "id": "bc-umami-ahck",
    "entity": "UMAMI",
    "code": "UMAMI-AHCK",
    "name": "Umami Khalifa City Cloud Kitchen"
  },
  {
    "id": "bc-umami-azc",
    "entity": "UMAMI",
    "code": "UMAMI-AZC",
    "name": "Umami City Centre Al Zahia – Sharjah"
  },
  {
    "id": "bc-umami-bjc",
    "entity": "UMAMI",
    "code": "UMAMI-BJC",
    "name": "Umami Burjuman Centre"
  },
  {
    "id": "bc-umami-ck",
    "entity": "UMAMI",
    "code": "UMAMI-CK",
    "name": "Umami Central Kitchen – Dubai"
  },
  {
    "id": "bc-umami-dcc",
    "entity": "UMAMI",
    "code": "UMAMI-DCC",
    "name": "Umami Deira City Centre"
  },
  {
    "id": "bc-umami-dfc",
    "entity": "UMAMI",
    "code": "UMAMI-DFC",
    "name": "Umami Dubai Festival City"
  },
  {
    "id": "bc-umami-dm2f",
    "entity": "UMAMI",
    "code": "UMAMI-DM2F",
    "name": "Umami 2F The Dubai Mall"
  },
  {
    "id": "bc-umami-dmlg",
    "entity": "UMAMI",
    "code": "UMAMI-DMLG",
    "name": "Umami LG The Dubai Mall"
  },
  {
    "id": "bc-umami-gal",
    "entity": "UMAMI",
    "code": "UMAMI-GAL",
    "name": "Umami Galleria Mall"
  },
  {
    "id": "bc-umami-ibn",
    "entity": "UMAMI",
    "code": "UMAMI-IBN",
    "name": "Umami IBN Battuta Mall"
  },
  {
    "id": "bc-umami-mcc",
    "entity": "UMAMI",
    "code": "UMAMI-MCC",
    "name": "Umami Mirdif City Centre"
  },
  {
    "id": "bc-umami-mcck",
    "entity": "UMAMI",
    "code": "UMAMI-MCCK",
    "name": "Umami Motor City Cloud Kitchen"
  },
  {
    "id": "bc-umami-me1f",
    "entity": "UMAMI",
    "code": "UMAMI-ME1F",
    "name": "Umami 1F Mall of Emirates"
  },
  {
    "id": "bc-umami-melg",
    "entity": "UMAMI",
    "code": "UMAMI-MELG",
    "name": "Umami LG Mall of Emirates"
  },
  {
    "id": "bc-umami-moe1",
    "entity": "UMAMI",
    "code": "UMAMI-MOE1",
    "name": "Umami 1F Mall of Emirates"
  },
  {
    "id": "bc-umami-nkm",
    "entity": "UMAMI",
    "code": "UMAMI-NKM",
    "name": "Umami Nakheel Mall"
  },
  {
    "id": "bc-umami-sup",
    "entity": "UMAMI",
    "code": "UMAMI-SUP",
    "name": "Umami Supplies"
  },
  {
    "id": "bc-umami-wh",
    "entity": "UMAMI",
    "code": "UMAMI-WH",
    "name": "Umami Warehouse"
  },
  {
    "id": "bc-umami-yas",
    "entity": "UMAMI",
    "code": "UMAMI-YAS",
    "name": "Umami Yas Mall"
  }
];


const DEFAULT_SUPPLIERS = [
  "Al Ammar Hardware",
  "Plus Point Building Materials",
  "Al Noon",
  "New Qamer Jasi Building Materials",
  "Citi Plus",
  "Index Oasis",
  "Free Lancer",
];


const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const EXCEL_UTI = "org.openxmlformats.spreadsheetml.sheet";

function sanitizeExportFileName(name) {
  return String(name || "DailyTask_Report")
    .replace(/[^a-zA-Z0-9_\-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

const BC_EXPORT_HEADERS = [
  "Line No.",
  "Expense Code",
  "G/L No.",
  "G/L Description",
  "Expense Date",
  "Work Description",
  "Vendor Name",
  "Gen. Bus. Posting Group",
  "VAT Bus. Posting Group",
  "Gen. Prod. Posting Group",
  "VAT Prod. Posting Group",
  "Expense Amount (Excl. VAT)",
  "Line amount",
  "VAT %",
  "VAT Amount",
  "Amount Including VAT",
  "Branch",
  "Employee Code",
  "Invoice No.",
  "VAT No.",
  "Department Code",
  "Accommodation Code",
  "Attachment",
  "Subtotal Excl. VAT (AED)",
  "Total Excl. VAT (AED)",
  "Total VAT (AED)",
  "Total Incl. VAT (AED)",
];

const REIMBURSEMENT_BC_EXPORT_HEADERS = BC_EXPORT_HEADERS;

// Business Central fixed values.
// These columns stay the same for every exported BC line.
// VAT Prod. Posting Group is calculated per line: VAT-5 when VAT is applied, otherwise VAT-0.
const BC_FIXED_EXPENSE_CODE = "";
const BC_FIXED_GL_NO = "";
const BC_FIXED_GL_DESCRIPTION = "";
const BC_FIXED_GEN_BUS_POSTING_GROUP = "DOMESTIC";
const BC_FIXED_VAT_BUS_POSTING_GROUP = "V-DXB";
const BC_FIXED_GEN_PROD_POSTING_GROUP = "GL";
const BC_FIXED_DEPARTMENT_CODE = "IT";
const BC_FIXED_LINE_AMOUNT = 0;
const BC_FIXED_ATTACHMENT = 0;

const REIMBURSEMENT_BC_FIXED_GEN_BUS_POSTING_GROUP = BC_FIXED_GEN_BUS_POSTING_GROUP;
const REIMBURSEMENT_BC_FIXED_VAT_BUS_POSTING_GROUP = BC_FIXED_VAT_BUS_POSTING_GROUP;
const REIMBURSEMENT_BC_FIXED_GEN_PROD_POSTING_GROUP = BC_FIXED_GEN_PROD_POSTING_GROUP;
const REIMBURSEMENT_BC_FIXED_DEPARTMENT_CODE = BC_FIXED_DEPARTMENT_CODE;
const REIMBURSEMENT_BC_FIXED_ATTACHMENT = BC_FIXED_ATTACHMENT;

function getBcVatProdPostingGroup(vatAmount) {
  return roundMoney(vatAmount) > 0 ? "VAT-5" : "VAT-0";
}

function getReimbursementBcExpenseCode(expenseType) {
  return expenseType === "Food & Accommodation" ? "STAFF FOOD & ENT" : "OFFICE STAFFTRANSPOR";
}

function getReimbursementBcVendorName(expenseType) {
  return expenseType === "Food & Accommodation" ? "Restaurant" : "Parkin";
}

function getReimbursementBcVatBreakdown(record) {
  const total = roundMoney(record?.amount);
  const expenseType = record?.expenseType || "";

  // Reimbursement BC rule:
  // Food & Accommodation and Parking bills are VAT-inclusive, so export as VAT-5.
  // Salik and Other Transportation remain VAT-0 for now.
  const hasVat = expenseType === "Food & Accommodation" || expenseType === "Parking";

  if (!hasVat) {
    return {
      amountExVat: total,
      vatPercent: 0,
      vatAmount: 0,
      amountIncludingVat: total,
      vatProdPostingGroup: "VAT-0",
    };
  }

  const amountExVat = roundMoney(total / 1.05);
  const vatAmount = roundMoney(total - amountExVat);

  return {
    amountExVat,
    vatPercent: 5,
    vatAmount,
    amountIncludingVat: total,
    vatProdPostingGroup: "VAT-5",
  };
}

let activeAppAlertSetter = null;

function showAppAlert(title, message = "", buttons = [{ text: "OK" }]) {
  const cleanButtons = Array.isArray(buttons) && buttons.length > 0 ? buttons : [{ text: "OK" }];

  if (activeAppAlertSetter) {
    activeAppAlertSetter({
      visible: true,
      title: String(title || "DailyTask"),
      message: String(message || ""),
      buttons: cleanButtons,
    });
    return;
  }

  Alert.alert(title, message, cleanButtons);
}

function AppAlertHost() {
  const [appAlert, setAppAlert] = useState(null);

  useEffect(() => {
    activeAppAlertSetter = setAppAlert;
    return () => {
      if (activeAppAlertSetter === setAppAlert) activeAppAlertSetter = null;
    };
  }, []);

  if (!appAlert?.visible) return null;

  const actions = Array.isArray(appAlert.buttons) && appAlert.buttons.length > 0
    ? appAlert.buttons
    : [{ text: "OK" }];

  function closeWithAction(action) {
    setAppAlert(null);
    if (typeof action?.onPress === "function") {
      setTimeout(() => action.onPress(), 120);
    }
  }

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent>
      <View style={styles.appPopupOverlay}>
        <View style={styles.appPopupCard}>
          <View style={styles.appPopupIconCircle}>
            <Text style={styles.appPopupIconText}>!</Text>
          </View>
          <Text style={styles.appPopupTitle}>{appAlert.title}</Text>
          {appAlert.message ? <Text style={styles.appPopupMessage}>{appAlert.message}</Text> : null}
          <View style={styles.appPopupButtonRow}>
            {actions.map((action, index) => {
              const isCancel = action?.style === "cancel";
              const isDanger = action?.style === "destructive";
              const isPrimary = !isCancel && !isDanger;

              return (
                <Pressable
                  key={`${action?.text || "Action"}-${index}`}
                  style={[
                    styles.appPopupButton,
                    isPrimary && styles.appPopupButtonPrimary,
                    isCancel && styles.appPopupButtonLight,
                    isDanger && styles.appPopupButtonDanger,
                  ]}
                  onPress={() => closeWithAction(action)}
                >
                  <Text
                    style={[
                      styles.appPopupButtonText,
                      isPrimary && styles.appPopupButtonTextPrimary,
                      isCancel && styles.appPopupButtonTextLight,
                      isDanger && styles.appPopupButtonTextDanger,
                    ]}
                  >
                    {action?.text || "OK"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}


const emptyAttendance = {
  checkIn: "",
  checkOut: "",
  status: "Not Started",
  dayType: "Work Day",
  normalDutyHours: "9",
  extraHoursUsed: "",
  note: "",
};

const ATTENDANCE_MAIN_TYPES = ["Work Day", "Day Off / Leave", "Public Holiday", "Off Cancelled"];

const ATTENDANCE_LEAVE_TYPES = [
  "Normal Day Off",
  "Pending Off Taken",
  "Annual Leave",
  "Sick Leave",
  "Emergency Leave",
  "Unpaid Leave",
  "Other Leave",
];

const ATTENDANCE_PH_TYPES = ["PH Off", "PH Worked", "PH Comp Off Taken"];

const ATTENDANCE_DAY_TYPES = [
  "Work Day",
  ...ATTENDANCE_LEAVE_TYPES,
  ...ATTENDANCE_PH_TYPES,
  "Off Cancelled",
];

const emptyTask = {
  title: "",
  category: "Company",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  followUpDate: "",
  notes: "",
};

const emptyCashReceived = {
  date: getTodayKey(),
  amount: "",
  receivedFrom: "Office",
  notes: "",
};

const emptyTransfer = {
  date: getTodayKey(),
  transferType: "Transfer Out",
  personName: "",
  amount: "",
  purpose: "",
  notes: "",
};

const emptyMonthClosing = {
  date: getTodayKey(),
  settlementTo: "Office",
  amount: "",
  notes: "",
};

const emptyExpense = {
  date: getTodayKey(),
  supplier: "",
  company: "",
  branch: "",
  bcBranchCode: "",
  itemDescription: "",
  invoiceAmount: "",
  vatType: "VAT Included",
  manualExVat: "",
  manualVat: "",
  invoiceNumber: "",
  paidBy: "",
  notes: "",
};

const emptyReimbursement = {
  date: getTodayKey(),
  company: "",
  branch: "",
  bcBranchCode: "",
  purpose: "",
  expenseType: "Parking",
  amount: "",
  receiptNo: "",
  notes: "",
  status: "Pending",
};

const emptyReimbursementClaim = {
  fromDate: "",
  toDate: "",
  submitDate: getTodayKey(),
  submittedTo: "Rahim",
  notes: "",
};

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);

  const [profileData, setProfileData] = useState(demoUser);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef(null);
  const signupPasswordInputRef = useRef(null);
  const signupConfirmPasswordInputRef = useRef(null);
  const signupPhoneInputRef = useRef(null);
  const signupEmailInputRef = useRef(null);
  const forgotNewPasswordInputRef = useRef(null);
  const forgotConfirmPasswordInputRef = useRef(null);
  const lockPasswordInputRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const appStateLockBypassUntilRef = useRef(0);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoPulseAnim = useRef(new Animated.Value(0)).current;

  const [editProfile, setEditProfile] = useState({
    fullName: "",
    employeeId: "",
    phone: "",
    email: "",
    designation: "",
    department: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotRecoveryForm, setForgotRecoveryForm] = useState({
    identifier: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    recoveryPhone: "",
    recoveryEmail: "",
  });

  const [todayAttendance, setTodayAttendance] = useState({
    ...emptyAttendance,
    date: getTodayKey(),
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceMonth, setAttendanceMonth] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
  });
  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  const [editAttendanceNote, setEditAttendanceNote] = useState("");
  const [showDutySettings, setShowDutySettings] = useState(false);
  const [attendanceHistoryFilter, setAttendanceHistoryFilter] = useState("All");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [cashReceivedRecords, setCashReceivedRecords] = useState([]);
  const [pettyCashExpenses, setPettyCashExpenses] = useState([]);
  const [cashTransfers, setCashTransfers] = useState([]);
  const [pettyClosings, setPettyClosings] = useState([]);
  const [pettyCashSearch, setPettyCashSearch] = useState("");

  const [editingCashReceivedId, setEditingCashReceivedId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingTransferId, setEditingTransferId] = useState(null);

  const [newCashReceived, setNewCashReceived] = useState(emptyCashReceived);
  const [newTransfer, setNewTransfer] = useState(emptyTransfer);
  const [newMonthClosing, setNewMonthClosing] = useState(emptyMonthClosing);
  const [newExpense, setNewExpense] = useState(emptyExpense);

  const [companyBranchesData, setCompanyBranchesData] = useState(DEFAULT_COMPANY_BRANCHES);
  const [supplierData, setSupplierData] = useState(DEFAULT_SUPPLIERS);
  const [bcBranchData, setBcBranchData] = useState(DEFAULT_BC_BRANCH_CODES);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newBranchCompany, setNewBranchCompany] = useState("QSR");
  const [newBranchName, setNewBranchName] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newBcBranchEntity, setNewBcBranchEntity] = useState("");
  const [newBcBranchCode, setNewBcBranchCode] = useState("");
  const [newBcBranchName, setNewBcBranchName] = useState("");
  const [bcBranchMasterSearch, setBcBranchMasterSearch] = useState("");
  const [masterTab, setMasterTab] = useState("Company");

  const [pettyReportMonth, setPettyReportMonth] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
  });
  const [pettyReportFromDate, setPettyReportFromDate] = useState(() => getCurrentMonthRange().from);
  const [pettyReportToDate, setPettyReportToDate] = useState(() => getCurrentMonthRange().to);

  const [reimbursementRecords, setReimbursementRecords] = useState([]);
  const [reimbursementClaims, setReimbursementClaims] = useState([]);
  const [editingReimbursementId, setEditingReimbursementId] = useState(null);
  const [newReimbursement, setNewReimbursement] = useState(emptyReimbursement);
  const [newReimbursementClaim, setNewReimbursementClaim] = useState(() => {
    const range = getDefaultClaimDateRange();
    return {
      ...emptyReimbursementClaim,
      fromDate: range.from,
      toDate: range.to,
      submitDate: getTodayKey(),
    };
  });
  const [reimbursementReportMonth, setReimbursementReportMonth] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
  });
  const [reimbursementReportFromDate, setReimbursementReportFromDate] = useState(() => getDefaultClaimDateRange().from);
  const [reimbursementReportToDate, setReimbursementReportToDate] = useState(() => getDefaultClaimDateRange().to);
  const [reimbursementFilter, setReimbursementFilter] = useState("All");

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== "Completed"),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "Completed"),
    [tasks]
  );
  const pendingTaskCount = activeTasks.length;
  const completedTaskCount = completedTasks.length;
  const todayFollowUpCount = activeTasks.filter((task) => taskNeedsFollowUp(task)).length;

  const monthRecords = useMemo(
    () => getRecordsForMonth(attendanceRecords, attendanceMonth.year, attendanceMonth.monthIndex),
    [attendanceRecords, attendanceMonth]
  );
  const monthSummary = useMemo(() => getMonthSummary(monthRecords), [monthRecords]);
  const carryForwardBalance = useMemo(
    () => getCarryForwardBalance(attendanceRecords, attendanceMonth.year, attendanceMonth.monthIndex),
    [attendanceRecords, attendanceMonth]
  );

  const pettyOpenPeriod = useMemo(
    () => getPettyCashOpenPeriodSummary(cashReceivedRecords, pettyCashExpenses, cashTransfers, pettyClosings),
    [cashReceivedRecords, pettyCashExpenses, cashTransfers, pettyClosings]
  );
  const pettyTotals = pettyOpenPeriod.totals;

  const pettyClosingHistory = useMemo(
    () => [...pettyClosings].sort((a, b) => {
      const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateCompare !== 0) return dateCompare;
      return Number(b.id || 0) - Number(a.id || 0);
    }),
    [pettyClosings]
  );

  const pettyCashSearchTerm = pettyCashSearch.trim().toLowerCase();
  const pettyCashSearchActive = pettyCashSearchTerm.length > 0;

  const filteredPettyCashExpenses = useMemo(() => {
    if (!pettyCashSearchTerm) return pettyCashExpenses;

    return pettyCashExpenses.filter((expense) => {
      const searchableText = [
        expense.supplier,
        expense.itemDescription,
        expense.invoiceNumber,
        expense.company,
        expense.branch,
        expense.bcBranchCode,
        expense.vatType,
        expense.paidBy,
        expense.notes,
        expense.date,
        formatDateForDisplay(expense.date),
        String(expense.totalAmount || ""),
      ].join(" ").toLowerCase();

      return searchableText.includes(pettyCashSearchTerm);
    });
  }, [pettyCashExpenses, pettyCashSearchTerm]);

  const filteredCashTransfers = useMemo(() => {
    if (!pettyCashSearchTerm) return cashTransfers;

    return cashTransfers.filter((transfer) => {
      const searchableText = [
        transfer.transferType,
        transfer.personName,
        transfer.purpose,
        transfer.notes,
        transfer.date,
        formatDateForDisplay(transfer.date),
        String(transfer.amount || ""),
      ].join(" ").toLowerCase();

      return searchableText.includes(pettyCashSearchTerm);
    });
  }, [cashTransfers, pettyCashSearchTerm]);

  const filteredCashReceivedRecords = useMemo(() => {
    if (!pettyCashSearchTerm) return cashReceivedRecords;

    return cashReceivedRecords.filter((record) => {
      const searchableText = [
        record.receivedFrom,
        record.notes,
        record.date,
        formatDateForDisplay(record.date),
        String(record.amount || ""),
      ].join(" ").toLowerCase();

      return searchableText.includes(pettyCashSearchTerm);
    });
  }, [cashReceivedRecords, pettyCashSearchTerm]);

  const pettyCashSearchResultCount =
    filteredPettyCashExpenses.length + filteredCashTransfers.length + filteredCashReceivedRecords.length;

  const currentExpenseCalc = useMemo(
    () => calculateExpenseAmounts(newExpense),
    [newExpense]
  );

  const pettyReport = useMemo(
    () => getPettyCashReportByDateRange(
      cashReceivedRecords,
      pettyCashExpenses,
      cashTransfers,
      pettyReportFromDate,
      pettyReportToDate
    ),
    [cashReceivedRecords, pettyCashExpenses, cashTransfers, pettyReportFromDate, pettyReportToDate]
  );


  const reimbursementReport = useMemo(
    () => getReimbursementReportByDateRange(
      reimbursementRecords,
      reimbursementReportFromDate,
      reimbursementReportToDate
    ),
    [reimbursementRecords, reimbursementReportFromDate, reimbursementReportToDate]
  );

  const reimbursementClaimReport = useMemo(
    () => getReimbursementReportByDateRange(
      reimbursementRecords,
      newReimbursementClaim.fromDate,
      newReimbursementClaim.toDate
    ),
    [reimbursementRecords, newReimbursementClaim.fromDate, newReimbursementClaim.toDate]
  );

  const reimbursementClaimEligibleRecords = useMemo(
    () => reimbursementClaimReport.orderedRecords.filter((record) => {
      const recordStatus = record.status || "Pending";
      return recordStatus === "Pending" && !record.claimId;
    }),
    [reimbursementClaimReport]
  );

  const reimbursementClaimEligibleReport = useMemo(
    () => getReimbursementReportByDateRange(
      reimbursementClaimEligibleRecords,
      newReimbursementClaim.fromDate,
      newReimbursementClaim.toDate
    ),
    [reimbursementClaimEligibleRecords, newReimbursementClaim.fromDate, newReimbursementClaim.toDate]
  );

  const reimbursementClaimHistory = useMemo(
    () => [...reimbursementClaims].sort((a, b) => {
      const dateCompare = String(b.submitDate || "").localeCompare(String(a.submitDate || ""));
      if (dateCompare !== 0) return dateCompare;
      return Number(b.id || 0) - Number(a.id || 0);
    }),
    [reimbursementClaims]
  );

  const companyList = useMemo(
    () => Object.keys(companyBranchesData).sort((a, b) => a.localeCompare(b)),
    [companyBranchesData]
  );


  const supplierList = useMemo(
    () => [...supplierData].sort((a, b) => a.localeCompare(b)),
    [supplierData]
  );

  const bcBranchList = useMemo(
    () => mergeBcBranchData(bcBranchData),
    [bcBranchData]
  );

  const bcBranchCodeOptions = useMemo(
    () => bcBranchList.map((item) => item.code),
    [bcBranchList]
  );

  const filteredBcBranchMasterList = useMemo(() => {
    const searchText = bcBranchMasterSearch.trim().toLowerCase();
    if (!searchText) return bcBranchList;

    return bcBranchList.filter((item) => {
      const searchableText = [
        item.code,
        item.name,
        item.entity,
      ].join(" ").toLowerCase();

      return searchableText.includes(searchText);
    });
  }, [bcBranchList, bcBranchMasterSearch]);

  function getBcBranchOptionsForCompany(company) {
    const selectedCompany = String(company || "").trim().toUpperCase();
    if (!selectedCompany) return bcBranchCodeOptions;

    const matchedCodes = bcBranchList
      .filter((item) => String(item.entity || "").trim().toUpperCase() === selectedCompany)
      .map((item) => item.code);

    return matchedCodes.length > 0 ? matchedCodes : bcBranchCodeOptions;
  }

  function getBcBranchDisplayText(code) {
    const selectedCode = String(code || "").trim().toUpperCase();
    const found = bcBranchList.find((item) => item.code === selectedCode);
    if (!found) return "";
    return `${found.entity} • ${found.name || found.code}`;
  }

  function getBcBranchItemByCode(code) {
    const selectedCode = String(code || "").trim().toUpperCase();
    if (!selectedCode) return null;
    return bcBranchList.find((item) => item.code === selectedCode) || null;
  }

  function getCompanyNameFromBcBranch(item) {
    return String(item?.entity || "").trim().toUpperCase();
  }

  function getBranchNameFromBcBranch(item) {
    return normalizeTitleText(item?.name || item?.code || "");
  }

  function applyBcBranchToExpense(bcBranchCode) {
    const selectedCode = String(bcBranchCode || "").trim().toUpperCase();

    if (!selectedCode) {
      setNewExpense({ ...newExpense, bcBranchCode: "" });
      return;
    }

    const selectedItem = getBcBranchItemByCode(selectedCode);
    const mappedCompany = getCompanyNameFromBcBranch(selectedItem);
    const mappedBranch = getBranchNameFromBcBranch(selectedItem);

    setNewExpense({
      ...newExpense,
      bcBranchCode: selectedCode,
      company: mappedCompany || newExpense.company,
      branch: mappedBranch || newExpense.branch,
    });
  }

  function applyBcBranchToReimbursement(bcBranchCode) {
    const selectedCode = String(bcBranchCode || "").trim().toUpperCase();

    if (!selectedCode) {
      setNewReimbursement({ ...newReimbursement, bcBranchCode: "" });
      return;
    }

    const selectedItem = getBcBranchItemByCode(selectedCode);
    const mappedCompany = getCompanyNameFromBcBranch(selectedItem);
    const mappedBranch = getBranchNameFromBcBranch(selectedItem);

    setNewReimbursement({
      ...newReimbursement,
      bcBranchCode: selectedCode,
      company: mappedCompany || newReimbursement.company,
      branch: mappedBranch || newReimbursement.branch,
    });
  }

  const workedTimeText =
    todayAttendance.checkIn && todayAttendance.checkOut
      ? calculateWorkedTime(todayAttendance.checkIn, todayAttendance.checkOut)
      : "--";

  const extraTimeText =
    todayAttendance.checkIn && todayAttendance.checkOut
      ? calculateExtraTime(
          todayAttendance.checkIn,
          todayAttendance.checkOut,
          todayAttendance.normalDutyHours
        )
      : "--";

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, floatAnim1, floatAnim2, logoPulseAnim]);

  useEffect(() => {
    if (!isStorageReady) return;
    saveAppData();
  }, [
    isStorageReady,
    profileData,
    todayAttendance,
    attendanceRecords,
    tasks,
    cashReceivedRecords,
    pettyCashExpenses,
    cashTransfers,
    pettyClosings,
    companyBranchesData,
    supplierData,
    bcBranchData,
    reimbursementRecords,
    reimbursementClaims,
    biometricEnabled,
  ]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasActive = appStateRef.current === "active";
      const isGoingAway = nextAppState === "inactive" || nextAppState === "background";

      const bypassLock = Date.now() < appStateLockBypassUntilRef.current;

      if (isLoggedIn && wasActive && isGoingAway && !bypassLock) {
        setIsSessionLocked(true);
        setUnlockPassword("");
        Keyboard.dismiss();
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isLoggedIn]);

  useEffect(() => {
    const backSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
      Keyboard.dismiss();

      if (isSessionLocked) {
        closeAppWithConfirmation();
        return true;
      }

      if (isLoggedIn) {
        if (screen === "dashboard") {
          closeAppWithConfirmation();
          return true;
        }

        goBack();
        return true;
      }

      if (screen === "welcome") {
        return false;
      }

      goBack();
      return true;
    });

    return () => backSubscription.remove();
  }, [screen, isLoggedIn, isSessionLocked]);

  async function loadSavedData() {
    try {
      const savedDataText = await AsyncStorage.getItem(STORAGE_KEY);
      if (!savedDataText) {
        setIsStorageReady(true);
        return;
      }

      const savedData = JSON.parse(savedDataText);
      const loadedProfile = normalizeLocalProfile(savedData.profileData);

      const loadedAttendanceRecords = Array.isArray(savedData.attendanceRecords)
        ? savedData.attendanceRecords
        : [];
      const todayKey = getTodayKey();
      const savedTodayRecord = loadedAttendanceRecords.find((record) => record.date === todayKey);

      let loadedTodayAttendance = { ...emptyAttendance, date: todayKey };
      if (savedData.todayAttendance?.date === todayKey) {
        loadedTodayAttendance = { ...emptyAttendance, ...savedData.todayAttendance, date: todayKey };
      } else if (savedTodayRecord) {
        loadedTodayAttendance = { ...emptyAttendance, ...savedTodayRecord, date: todayKey };
      }

      setProfileData(loadedProfile);
      setScreen("login");
      setTodayAttendance(loadedTodayAttendance);
      setAttendanceRecords(loadedAttendanceRecords);
      setTasks(Array.isArray(savedData.tasks) ? savedData.tasks : []);
      setCashReceivedRecords(
        Array.isArray(savedData.cashReceivedRecords) ? savedData.cashReceivedRecords : []
      );
      setPettyCashExpenses(
        Array.isArray(savedData.pettyCashExpenses) ? savedData.pettyCashExpenses : []
      );
      setCashTransfers(Array.isArray(savedData.cashTransfers) ? savedData.cashTransfers : []);
      setPettyClosings(Array.isArray(savedData.pettyClosings) ? savedData.pettyClosings : []);
      const loadedSuppliers = mergeSupplierLists(
        DEFAULT_SUPPLIERS,
        savedData.supplierData,
        savedData.pettyCashExpenses
      );
      setSupplierData(loadedSuppliers);
      setBcBranchData(mergeBcBranchData(savedData.bcBranchData));
      setReimbursementRecords(
        Array.isArray(savedData.reimbursementRecords) ? savedData.reimbursementRecords : []
      );
      setReimbursementClaims(
        Array.isArray(savedData.reimbursementClaims) ? savedData.reimbursementClaims : []
      );
      setBiometricEnabled(savedData.biometricEnabled === true);

      const loadedCompanyBranches = isValidCompanyBranches(savedData.companyBranchesData)
        ? savedData.companyBranchesData
        : DEFAULT_COMPANY_BRANCHES;
      setCompanyBranchesData(mergeCompanyBranches(DEFAULT_COMPANY_BRANCHES, loadedCompanyBranches));
      const firstCompany = Object.keys(loadedCompanyBranches)[0] || "QSR";
      setNewBranchCompany(firstCompany);
    } catch (error) {
      console.log("Storage load error:", error);
      showAppAlert("Storage Load Error", "Saved data could not be loaded. Please update to the hotfix version. The app will continue with empty data for now.");
    } finally {
      setIsStorageReady(true);
    }
  }

  function buildStorageData() {
    return {
      profileData,
      todayAttendance,
      attendanceRecords,
      tasks,
      cashReceivedRecords,
      pettyCashExpenses,
      cashTransfers,
      pettyClosings,
      companyBranchesData,
      supplierData,
      bcBranchData,
      reimbursementRecords,
      reimbursementClaims,
      biometricEnabled,
      savedAt: new Date().toISOString(),
    };
  }

  async function saveAppData() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buildStorageData()));
    } catch (error) {
      console.log("Save error:", error);
    }
  }

  function applyImportedData(importedData) {
    const data = importedData?.data && typeof importedData.data === "object"
      ? importedData.data
      : importedData;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid backup file format");
    }

    const loadedProfile = normalizeLocalProfile(data.profileData);

    const loadedAttendanceRecords = Array.isArray(data.attendanceRecords)
      ? data.attendanceRecords
      : [];
    const todayKey = getTodayKey();
    const savedTodayRecord = loadedAttendanceRecords.find((record) => record.date === todayKey);

    let loadedTodayAttendance = { ...emptyAttendance, date: todayKey };
    if (data.todayAttendance?.date === todayKey) {
      loadedTodayAttendance = { ...emptyAttendance, ...data.todayAttendance, date: todayKey };
    } else if (savedTodayRecord) {
      loadedTodayAttendance = { ...emptyAttendance, ...savedTodayRecord, date: todayKey };
    }

    const loadedCompanyBranches = isValidCompanyBranches(data.companyBranchesData)
      ? data.companyBranchesData
      : DEFAULT_COMPANY_BRANCHES;
    const mergedCompanyBranches = mergeCompanyBranches(DEFAULT_COMPANY_BRANCHES, loadedCompanyBranches);

    const loadedSuppliers = mergeSupplierLists(
      DEFAULT_SUPPLIERS,
      data.supplierData,
      data.pettyCashExpenses
    );

    setProfileData(loadedProfile);
    setCurrentUser(loadedProfile);
    setTodayAttendance(loadedTodayAttendance);
    setAttendanceRecords(loadedAttendanceRecords);
    setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    setCashReceivedRecords(
      Array.isArray(data.cashReceivedRecords) ? data.cashReceivedRecords : []
    );
    setPettyCashExpenses(
      Array.isArray(data.pettyCashExpenses) ? data.pettyCashExpenses : []
    );
    setCashTransfers(Array.isArray(data.cashTransfers) ? data.cashTransfers : []);
    setPettyClosings(Array.isArray(data.pettyClosings) ? data.pettyClosings : []);
    setCompanyBranchesData(mergedCompanyBranches);
    setSupplierData(loadedSuppliers);
    setBcBranchData(mergeBcBranchData(data.bcBranchData));
    setReimbursementRecords(
      Array.isArray(data.reimbursementRecords) ? data.reimbursementRecords : []
    );
    setReimbursementClaims(
      Array.isArray(data.reimbursementClaims) ? data.reimbursementClaims : []
    );
    setBiometricEnabled(data.biometricEnabled === true);

    const firstCompany = Object.keys(mergedCompanyBranches)[0] || "QSR";
    setNewBranchCompany(firstCompany);
  }

  async function exportBackupJson() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Backup sharing is not available on this device.");
        return;
      }

      const backup = {
        backupInfo: {
          appName: "DailyTask",
          backupVersion: "1.0",
          exportedAt: new Date().toISOString(),
          exportedBy: profileData.fullName || currentUser?.fullName || "DailyTask User",
        },
        data: buildStorageData(),
      };

      const fileName = `DailyTask_Backup_${getTodayKey()}_${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backup, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Share DailyTask Backup",
        UTI: "public.json",
      });
    } catch (error) {
      console.log("Backup export error:", error);
      showAppAlert("Backup Failed", "Could not create backup file. Send me the error screenshot if it repeats.");
    }
  }

  async function importBackupJson() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.type === "cancel") {
        return;
      }

      const selectedFile = result.assets?.[0] || result;
      const fileUri = selectedFile.uri;

      if (!fileUri) {
        showAppAlert("Import Failed", "No backup file was selected.");
        return;
      }

      const fileText = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsedBackup = JSON.parse(fileText);
      const restoreData = parsedBackup?.data && typeof parsedBackup.data === "object"
        ? parsedBackup.data
        : parsedBackup;

      showAppAlert(
        "Restore Backup",
        "This will replace the current app data with the selected backup file. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              try {
                applyImportedData(parsedBackup);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                  ...restoreData,
                  restoredAt: new Date().toISOString(),
                }));
                showAppAlert("Restore Completed", "Backup restored successfully. Close and reopen the app once if anything does not refresh.");
              } catch (restoreError) {
                console.log("Restore apply error:", restoreError);
                showAppAlert("Restore Failed", "This backup file is not compatible with DailyTask.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log("Backup import error:", error);
      showAppAlert("Import Failed", "Could not read this backup file. Please select a valid DailyTask JSON backup.");
    }
  }

  function closeAppWithConfirmation() {
    showAppAlert(
      "Close DailyTask?",
      "Are you sure you want to close the app?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close",
          style: "destructive",
          onPress: () => BackHandler.exitApp(),
        },
      ]
    );
  }

  function unlockSessionWithPassword() {
    const localProfile = normalizeLocalProfile(profileData);
    const savedPassword = localProfile.password || demoUser.password;

    if (unlockPassword === savedPassword) {
      Keyboard.dismiss();
      setUnlockPassword("");
      setIsSessionLocked(false);
      return;
    }

    showAppAlert("Authentication Failed", "Please enter the correct password to unlock DailyTask.");
  }

  function handleUnlockPasswordSubmit() {
    Keyboard.dismiss();
    unlockSessionWithPassword();
  }

  async function unlockSessionWithBiometric() {
    if (!biometricEnabled) {
      showAppAlert("Biometric Disabled", "Use your password to unlock DailyTask.");
      return;
    }

    const canUseBiometric = await checkBiometricAvailability();
    if (!canUseBiometric) return;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock DailyTask",
        cancelLabel: "Cancel",
        fallbackLabel: "Use phone lock",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setUnlockPassword("");
        setIsSessionLocked(false);
      } else {
        showAppAlert("Unlock Cancelled", "DailyTask was not unlocked.");
      }
    } catch (error) {
      console.log("Session unlock biometric error:", error);
      showAppAlert("Biometric Unlock Failed", "Use your password to unlock DailyTask.");
    }
  }

  function goBack() {
    if (screen === "login") return setScreen("welcome");
    if (screen === "signup") return setScreen("login");
    if (screen === "forgotPassword") return setScreen("login");
    if (screen === "profile") return setScreen("dashboard");
    if (screen === "editProfile") return setScreen("profile");
    if (screen === "changePassword") return setScreen("profile");
    if (screen === "attendance") return setScreen("dashboard");
    if (screen === "attendanceHistory") return setScreen("attendance");
    if (screen === "editAttendance") return setScreen("attendance");
    if (screen === "tasks") return setScreen("dashboard");
    if (screen === "completedTasks") return setScreen("tasks");
    if (screen === "addTask") {
      resetTaskForm();
      return setScreen("tasks");
    }
    if (screen === "pettyCash") return setScreen("dashboard");
    if (screen === "pettyMonthClosing") return setScreen("pettyCash");
    if (screen === "pettyReport") return setScreen("pettyCash");
    if (screen === "masterData") return setScreen("dashboard");
    if (screen === "backupRestore") return setScreen("dashboard");
    if (screen === "reimbursement") return setScreen("dashboard");
    if (screen === "reimbursementReport") return setScreen("reimbursement");
    if (screen === "reimbursementClaimSettlement") return setScreen("reimbursement");
    if (screen === "addReimbursement") {
      resetReimbursementForm();
      return setScreen("reimbursement");
    }
    if (screen === "addCashReceived") {
      resetCashReceivedForm();
      return setScreen("pettyCash");
    }
    if (screen === "addPettyExpense") {
      resetExpenseForm();
      return setScreen("pettyCash");
    }
    if (screen === "addCashTransfer") {
      resetTransferForm();
      return setScreen("pettyCash");
    }
    setScreen("dashboard");
  }

  function completeLocalLogin(localProfile) {
    const normalizedProfile = normalizeLocalProfile(localProfile);
    Keyboard.dismiss();
    setProfileData(normalizedProfile);
    setCurrentUser(normalizedProfile);
    setIsLoggedIn(true);
    setIsSessionLocked(false);
    setUnlockPassword("");
    setUsername("");
    setPassword("");

    if (!normalizedProfile.profileSetupCompleted) {
      setEditProfile({
        fullName: normalizedProfile.fullName || "",
        employeeId: normalizedProfile.employeeId || "",
        phone: normalizedProfile.phone || "",
        email: normalizedProfile.email || "",
        designation: normalizedProfile.designation || "",
        department: normalizedProfile.department || "",
      });
      setScreen("setupProfile");
    } else {
      setScreen("dashboard");
    }
  }

  function handleLogin() {
    const localProfile = normalizeLocalProfile(profileData);
    const savedUsername = localProfile.username || demoUser.username;
    const savedPassword = localProfile.password || demoUser.password;

    if (
      username.trim().toLowerCase() === savedUsername.trim().toLowerCase() &&
      password === savedPassword
    ) {
      completeLocalLogin(localProfile);
      return;
    }
    showAppAlert("Login Failed", "Please check your username and password.");
  }

  function handlePasswordSubmit() {
    Keyboard.dismiss();
    handleLogin();
  }

  async function checkBiometricAvailability() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        showAppAlert("Biometric Not Available", "This phone does not support biometric login.");
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        showAppAlert("Biometric Not Set", "Please add fingerprint, face unlock or screen lock in your phone settings first.");
        return false;
      }

      return true;
    } catch (error) {
      console.log("Biometric check error:", error);
      showAppAlert("Biometric Error", "Could not check biometric availability on this phone.");
      return false;
    }
  }

  async function loginWithBiometric() {
    if (!biometricEnabled) {
      showAppAlert("Biometric Disabled", "Enable biometric login from Backup / Restore → Security Settings first.");
      return;
    }

    const canUseBiometric = await checkBiometricAvailability();
    if (!canUseBiometric) return;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login to DailyTask",
        cancelLabel: "Cancel",
        fallbackLabel: "Use phone lock",
        disableDeviceFallback: false,
      });

      if (result.success) {
        completeLocalLogin(profileData);
      } else {
        showAppAlert("Login Cancelled", "Biometric login was not completed.");
      }
    } catch (error) {
      console.log("Biometric login error:", error);
      showAppAlert("Biometric Login Failed", "Could not login with biometric. Use your password once and try again.");
    }
  }

  async function enableBiometricLogin() {
    const canUseBiometric = await checkBiometricAvailability();
    if (!canUseBiometric) return;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable DailyTask biometric login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use phone lock",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricEnabled(true);
        showAppAlert("Biometric Enabled", "You can now login using fingerprint, face unlock or phone lock on this device.");
      } else {
        showAppAlert("Not Enabled", "Biometric login was not enabled.");
      }
    } catch (error) {
      console.log("Enable biometric error:", error);
      showAppAlert("Biometric Error", "Could not enable biometric login.");
    }
  }

  function disableBiometricLogin() {
    showAppAlert(
      "Disable Biometric Login",
      "This will remove biometric login from this phone. You can still login using username and password.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: () => {
            setBiometricEnabled(false);
            showAppAlert("Biometric Disabled", "Biometric login has been disabled on this phone.");
          },
        },
      ]
    );
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setIsSessionLocked(false);
    setUnlockPassword("");
    setCurrentUser(null);
    setScreen("login");
  }

  function getFirstName() {
    if (!currentUser?.fullName) return "User";
    return currentUser.fullName.split(" ")[0];
  }

  function getInitial() {
    if (!currentUser?.fullName) return "U";
    return currentUser.fullName.trim().charAt(0).toUpperCase();
  }

  function openEditProfile() {
    const profileToEdit = currentUser || profileData;
    setEditProfile({
      fullName: profileToEdit.fullName || "",
      employeeId: profileToEdit.employeeId || "",
      phone: profileToEdit.phone || "",
      email: profileToEdit.email || "",
      designation: profileToEdit.designation || "",
      department: profileToEdit.department || "",
    });
    setScreen("editProfile");
  }

  function saveProfile() {
    if (!editProfile.fullName.trim()) {
      showAppAlert("Missing Name", "Please enter your full name.");
      return;
    }
    const updatedProfile = {
      ...profileData,
      fullName: editProfile.fullName.trim(),
      employeeId: editProfile.employeeId.trim(),
      phone: editProfile.phone.trim(),
      email: editProfile.email.trim(),
      designation: editProfile.designation.trim(),
      department: editProfile.department.trim(),
      profileSetupCompleted: true,
    };
    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    showAppAlert("Saved", "Profile updated successfully.");
    setScreen("profile");
  }

  function saveInitialProfile() {
    if (!editProfile.fullName.trim()) {
      showAppAlert("Missing Name", "Please enter your name or continue as Admin.");
      return;
    }

    const updatedProfile = {
      ...profileData,
      fullName: editProfile.fullName.trim(),
      employeeId: editProfile.employeeId.trim(),
      phone: editProfile.phone.trim(),
      email: editProfile.email.trim(),
      designation: editProfile.designation.trim(),
      department: editProfile.department.trim(),
      profileSetupCompleted: true,
    };

    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    setScreen("dashboard");
  }

  function continueAsAdminProfile() {
    const updatedProfile = {
      ...profileData,
      fullName: profileData.fullName || demoUser.fullName,
      employeeId: profileData.employeeId || "",
      designation: profileData.designation || "",
      department: profileData.department || "",
      profileSetupCompleted: true,
    };

    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    setScreen("dashboard");
  }

  async function pickProfilePhoto() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAppAlert(
          "Permission Required",
          "Please allow photo access to select your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (result.canceled) return;

      const selectedUri = result.assets?.[0]?.uri;
      if (!selectedUri) {
        showAppAlert("Photo Error", "No photo was selected.");
        return;
      }

      const profileFolder = `${FileSystem.documentDirectory}profile/`;
      const folderInfo = await FileSystem.getInfoAsync(profileFolder);

      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(profileFolder, { intermediates: true });
      }

      const extension = getFileExtensionFromUri(selectedUri) || "jpg";
      const localPhotoUri = `${profileFolder}profile_${Date.now()}.${extension}`;

      await FileSystem.copyAsync({
        from: selectedUri,
        to: localPhotoUri,
      });

      const updatedProfile = {
        ...profileData,
        profilePhotoUri: localPhotoUri,
      };

      setProfileData(updatedProfile);
      setCurrentUser(updatedProfile);
      showAppAlert("Saved", "Profile photo updated successfully.");
    } catch (error) {
      console.log("Profile photo error:", error);
      showAppAlert("Photo Failed", "Could not update profile photo. Please try again.");
    }
  }

  function removeProfilePhoto() {
    showAppAlert("Remove Photo", "Remove your current profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updatedProfile = {
            ...profileData,
            profilePhotoUri: "",
          };
          setProfileData(updatedProfile);
          setCurrentUser(updatedProfile);
        },
      },
    ]);
  }

  function saveLocalPassword() {
    const savedPassword = profileData.password || demoUser.password;
    const currentPasswordText = changePasswordForm.currentPassword;
    const newPasswordText = changePasswordForm.newPassword.trim();
    const confirmPasswordText = changePasswordForm.confirmPassword.trim();

    if (currentPasswordText !== savedPassword) {
      showAppAlert("Wrong Password", "Current password is not correct.");
      return;
    }

    if (newPasswordText.length < 4) {
      showAppAlert("Weak Password", "Please enter at least 4 characters for the new password.");
      return;
    }

    if (newPasswordText !== confirmPasswordText) {
      showAppAlert("Password Mismatch", "New password and confirm password do not match.");
      return;
    }

    const updatedProfile = {
      ...profileData,
      username: profileData.username || demoUser.username,
      password: newPasswordText,
    };

    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showAppAlert("Password Updated", "Your local login password has been changed.");
    setScreen("profile");
  }

  function resetPasswordToDefault() {
    showAppAlert(
      "Reset Password",
      "This will reset the login password on this phone to admin123. Your saved app data will not be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            const updatedProfile = {
              ...profileData,
              username: profileData.username || demoUser.username,
              password: demoUser.password,
            };
            setProfileData(updatedProfile);
            setCurrentUser(updatedProfile);
            setPassword("");
            setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            showAppAlert("Password Reset", "Login password is now admin123.");
          },
        },
      ]
    );
  }

  function openSignUpPage() {
    setSignupForm({
      username: "",
      password: "",
      confirmPassword: "",
      recoveryPhone: "",
      recoveryEmail: "",
    });
    setScreen("signup");
  }

  function hasExistingCustomLogin() {
    const localProfile = normalizeLocalProfile(profileData);
    const savedUsername = String(localProfile.username || "").trim().toLowerCase();
    const defaultUsername = String(demoUser.username || "").trim().toLowerCase();

    return Boolean(
      localProfile.profileSetupCompleted ||
      savedUsername !== defaultUsername ||
      localProfile.password !== demoUser.password ||
      localProfile.phone ||
      localProfile.email
    );
  }

  function createLocalAccount() {
    const usernameText = signupForm.username.trim();
    const passwordText = signupForm.password.trim();
    const confirmPasswordText = signupForm.confirmPassword.trim();
    const recoveryPhoneText = signupForm.recoveryPhone.trim();
    const recoveryEmailText = signupForm.recoveryEmail.trim().toLowerCase();

    if (hasExistingCustomLogin()) {
      showAppAlert("Account Already Created", "This phone already has a DailyTask account. Please use Login or Forgot Password.");
      return;
    }

    if (usernameText.length < 3) {
      showAppAlert("Missing Username", "Please enter a username with at least 3 characters.");
      return;
    }

    if (usernameText.includes(" ")) {
      showAppAlert("Invalid Username", "Username should not contain spaces.");
      return;
    }

    if (passwordText.length < 4) {
      showAppAlert("Weak Password", "Please enter at least 4 characters for the password.");
      return;
    }

    if (passwordText !== confirmPasswordText) {
      showAppAlert("Password Mismatch", "Password and confirm password do not match.");
      return;
    }

    if (!recoveryPhoneText && !recoveryEmailText) {
      showAppAlert("Recovery Required", "Please enter at least one recovery option: phone number or email ID.");
      return;
    }

    if (recoveryEmailText && !recoveryEmailText.includes("@")) {
      showAppAlert("Invalid Email", "Please enter a valid email ID, or leave email blank and use phone number.");
      return;
    }

    const updatedProfile = {
      ...profileData,
      username: usernameText,
      password: passwordText,
      phone: recoveryPhoneText || profileData.phone || "",
      email: recoveryEmailText || profileData.email || "",
      profileSetupCompleted: false,
    };

    Keyboard.dismiss();
    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    setUsername(usernameText);
    setPassword("");
    setSignupForm({
      username: "",
      password: "",
      confirmPassword: "",
      recoveryPhone: "",
      recoveryEmail: "",
    });
    showAppAlert("Sign Up Completed", `Account created successfully. Login with username: ${usernameText}`);
    setScreen("login");
  }

  function openForgotPasswordRecovery() {
    setForgotRecoveryForm({ identifier: "", newPassword: "", confirmPassword: "" });
    setScreen("forgotPassword");
  }

  function recoveryIdentifierMatchesProfile(identifier) {
    const value = String(identifier || "").trim();
    if (!value) return false;

    const savedEmail = String(profileData.email || "").trim().toLowerCase();
    const savedPhone = normalizePhoneNumber(profileData.phone || "");
    const enteredEmail = value.toLowerCase();
    const enteredPhone = normalizePhoneNumber(value);

    return Boolean(
      (savedEmail && enteredEmail === savedEmail) ||
      (savedPhone && enteredPhone && enteredPhone === savedPhone)
    );
  }

  function saveRecoveredPassword() {
    const identifier = forgotRecoveryForm.identifier.trim();
    const newPasswordText = forgotRecoveryForm.newPassword.trim();
    const confirmPasswordText = forgotRecoveryForm.confirmPassword.trim();

    if (!identifier) {
      showAppAlert("Missing Recovery Detail", "Enter your registered phone number or email ID.");
      return;
    }

    if (!profileData.email && !profileData.phone) {
      showAppAlert("Recovery Not Set", "No phone number or email ID is saved in this profile. Login once and update Profile, or clear app data if this is your own phone.");
      return;
    }

    if (!recoveryIdentifierMatchesProfile(identifier)) {
      showAppAlert("Verification Failed", "The phone number or email ID does not match the saved profile on this phone.");
      return;
    }

    if (newPasswordText.length < 4) {
      showAppAlert("Weak Password", "Please enter at least 4 characters for the new password.");
      return;
    }

    if (newPasswordText !== confirmPasswordText) {
      showAppAlert("Password Mismatch", "New password and confirm password do not match.");
      return;
    }

    const updatedProfile = {
      ...profileData,
      username: profileData.username || demoUser.username,
      password: newPasswordText,
    };
    setProfileData(updatedProfile);
    setCurrentUser(updatedProfile);
    setUsername(updatedProfile.username || demoUser.username);
    setPassword("");
    setForgotRecoveryForm({ identifier: "", newPassword: "", confirmPassword: "" });
    showAppAlert("Password Updated", `Your local login password has been updated. Login with username: ${updatedProfile.username || demoUser.username}`);
    setScreen("login");
  }

  function upsertAttendanceRecord(record) {
    const cleanRecord = { ...record, date: record.date || getTodayKey() };
    setAttendanceRecords((oldRecords) => {
      const existing = oldRecords.find((item) => item.date === cleanRecord.date);
      if (existing) {
        return oldRecords.map((item) => (item.date === cleanRecord.date ? cleanRecord : item));
      }
      return [cleanRecord, ...oldRecords];
    });
  }

  function handleClockIn() {
    if (todayAttendance.checkIn) {
      showAppAlert("Already Clocked In", "You already clocked in today.");
      return;
    }
    const blockedTypes = getNonWorkingAttendanceTypes();
    if (blockedTypes.includes(todayAttendance.dayType)) {
      showAppAlert("Not Work Day", "Change day type to Work Day, Off Cancelled, or PH Worked first.");
      return;
    }
    const nowTime = getCurrentTime24();
    const updatedRecord = {
      ...todayAttendance,
      date: getTodayKey(),
      checkIn: nowTime,
      status: "Clocked In",
      dayType: todayAttendance.dayType || "Work Day",
    };
    setTodayAttendance(updatedRecord);
    upsertAttendanceRecord(updatedRecord);
  }

  function handleClockOut() {
    if (!todayAttendance.checkIn) {
      showAppAlert("Clock In Required", "Please clock in first.");
      return;
    }
    if (todayAttendance.checkOut) {
      showAppAlert("Already Clocked Out", "You already clocked out today.");
      return;
    }
    const nowTime = getCurrentTime24();
    const updatedRecord = {
      ...todayAttendance,
      date: getTodayKey(),
      checkOut: nowTime,
      status: "Completed",
    };
    setTodayAttendance(updatedRecord);
    upsertAttendanceRecord(updatedRecord);
  }

  function setAttendanceDayType(type) {
    let updatedRecord = {
      ...todayAttendance,
      date: getTodayKey(),
      dayType: type,
      status: type,
    };
    const offTypes = getNonWorkingAttendanceTypes();
    if (offTypes.includes(type)) {
      updatedRecord = { ...updatedRecord, checkIn: "", checkOut: "" };
    }
    if (type === "Work Day") {
      updatedRecord.status = todayAttendance.checkIn ? "Clocked In" : "Not Started";
      if (todayAttendance.checkIn && todayAttendance.checkOut) updatedRecord.status = "Completed";
    }
    if (type === "Off Cancelled" || type === "PH Worked") {
      updatedRecord.status = todayAttendance.checkIn ? "Clocked In" : type;
      if (todayAttendance.checkIn && todayAttendance.checkOut) updatedRecord.status = "Completed";
    }
    setTodayAttendance(updatedRecord);
  }

  function saveAttendanceDetails() {
    const required = [
      "Off Cancelled",
      "PH Worked",
      "PH Off",
      "Pending Off Taken",
      "PH Comp Off Taken",
      "Annual Leave",
      "Sick Leave",
      "Emergency Leave",
      "Unpaid Leave",
      "Other Leave",
    ];
    if (required.includes(todayAttendance.dayType) && !todayAttendance.note.trim()) {
      showAppAlert("Reason Required", "Please add reason/notes for this attendance type.");
      return;
    }
    const updatedRecord = { ...todayAttendance, date: getTodayKey() };
    setTodayAttendance(updatedRecord);
    upsertAttendanceRecord(updatedRecord);
    showAppAlert("Saved", "Attendance details saved.");
  }

  function openEditAttendance() {
    setEditClockIn(todayAttendance.checkIn);
    setEditClockOut(todayAttendance.checkOut);
    setEditAttendanceNote(todayAttendance.note);
    setScreen("editAttendance");
  }

  function saveEditedAttendance() {
    let status = todayAttendance.dayType || "Work Day";
    if (todayAttendance.dayType === "Work Day") {
      status = "Not Started";
      if (editClockIn && !editClockOut) status = "Clocked In";
      if (editClockIn && editClockOut) status = "Completed";
    }
    if (todayAttendance.dayType === "Off Cancelled" || todayAttendance.dayType === "PH Worked") {
      if (editClockIn && !editClockOut) status = "Clocked In";
      if (editClockIn && editClockOut) status = "Completed";
    }
    const updatedRecord = {
      ...todayAttendance,
      date: getTodayKey(),
      checkIn: editClockIn,
      checkOut: editClockOut,
      note: editAttendanceNote,
      status,
    };
    setTodayAttendance(updatedRecord);
    upsertAttendanceRecord(updatedRecord);
    showAppAlert("Saved", "Attendance updated successfully.");
    setScreen("attendance");
  }

  function moveAttendanceMonth(direction) {
    const nextDate = new Date(attendanceMonth.year, attendanceMonth.monthIndex + direction, 1);
    setAttendanceMonth({ year: nextDate.getFullYear(), monthIndex: nextDate.getMonth() });
  }

  async function writeWorkbookAndShare(workbook, baseFileName, dialogTitle) {
    const fileName = `${sanitizeExportFileName(baseFileName)}.xlsx`;
    const folderUri = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    const fileUri = `${folderUri}${fileName}`;
    const workbookBase64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

    await FileSystem.writeAsStringAsync(fileUri, workbookBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists || !fileInfo.size) {
      throw new Error("Excel file was not created correctly.");
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: EXCEL_MIME_TYPE,
      dialogTitle,
      UTI: EXCEL_UTI,
    });
  }

  async function exportAttendanceTimesheetExcel() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const monthTitle = getMonthTitle(attendanceMonth.year, attendanceMonth.monthIndex);
      const safeMonthTitle = sanitizeExportFileName(monthTitle);

      const workbook = XLSX.utils.book_new();
      const rows = [
        [
          "Name",
          "Employee No.",
          "Position",
          "Department",
          "Date",
          "Duty time",
          "Punch In",
          "Punch Out",
          "Duty time",
          "Work time",
          "Late",
          "Early",
          "Overtime",
          "Absent time",
          "Actual time",
          "Breaktime",
          "Leavetime",
          "Exception",
        ],
      ];

      const profile = currentUser || profileData || {};
      const recordsByDate = attendanceRecords.reduce((map, record) => {
        if (record?.date) map[record.date] = record;
        return map;
      }, {});

      getAttendanceTimesheetDateKeys(attendanceMonth.year, attendanceMonth.monthIndex).forEach((dateKey) => {
        const record = recordsByDate[dateKey] || { ...emptyAttendance, date: dateKey };
        const rowData = buildAttendanceTimesheetRow(record);

        rows.push([
          profile.fullName || "",
          profile.employeeId || "",
          profile.designation || "",
          profile.department || "",
          formatDateForTimesheet(dateKey),
          DAILY_DUTY_TIME_TEXT,
          record.checkIn ? formatDisplayTime(record.checkIn) : "",
          record.checkOut ? formatDisplayTime(record.checkOut) : "",
          DAILY_DUTY_DURATION_TEXT,
          rowData.workTime,
          rowData.late,
          rowData.early,
          rowData.overtime,
          rowData.absentTime,
          rowData.actualTime,
          rowData.breakTime,
          rowData.leaveTime,
          rowData.exception,
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      worksheet["!cols"] = [
        { wch: 22 },
        { wch: 14 },
        { wch: 24 },
        { wch: 18 },
        { wch: 14 },
        { wch: 24 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_Attendance_Timesheet_${safeMonthTitle}`,
        "Share Attendance Timesheet"
      );
    } catch (error) {
      console.log("Attendance timesheet export error:", error);
      showAppAlert("Export Failed", "Attendance timesheet export failed. Send me the error screenshot if it repeats.");
    }
  }

  function resetTaskForm() {
    setEditingTaskId(null);
    setNewTask(emptyTask);
  }

  function openAddTask() {
    resetTaskForm();
    setScreen("addTask");
  }

  function openEditTask(task) {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title || "",
      category: task.category || "Company",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate || "",
      followUpDate: task.followUpDate || "",
      notes: task.notes || "",
    });
    setScreen("addTask");
  }

  function addTask() {
    if (!newTask.title.trim()) {
      showAppAlert("Missing Task", "Please enter task title.");
      return;
    }

    const cleanTask = {
      title: newTask.title.trim(),
      category: newTask.category,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate.trim(),
      followUpDate: newTask.followUpDate.trim(),
      notes: newTask.notes.trim(),
    };

    if (editingTaskId) {
      setTasks(tasks.map((task) => (
        task.id === editingTaskId
          ? { ...task, ...cleanTask, updatedAt: getTodayKey() }
          : task
      )));
      resetTaskForm();
      setScreen(cleanTask.status === "Completed" ? "completedTasks" : "tasks");
      return;
    }

    const task = {
      id: Date.now(),
      ...cleanTask,
      createdAt: getTodayKey(),
    };
    setTasks([task, ...tasks]);
    resetTaskForm();
    setScreen(task.status === "Completed" ? "completedTasks" : "tasks");
  }

  function changeTaskStatus(taskId) {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task;
        if (task.status === "Pending") return { ...task, status: "In Progress" };
        if (task.status === "In Progress") return { ...task, status: "Completed" };
        return { ...task, status: "Pending" };
      })
    );
  }

  function deleteTask(taskId) {
    showAppAlert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => setTasks(tasks.filter((task) => task.id !== taskId)) },
    ]);
  }

  function resetCashReceivedForm() {
    setEditingCashReceivedId(null);
    setNewCashReceived({ ...emptyCashReceived, date: getTodayKey() });
  }

  function resetTransferForm() {
    setEditingTransferId(null);
    setNewTransfer({ ...emptyTransfer, date: getTodayKey() });
  }

  function resetMonthClosingForm() {
    const settlementAmount = Math.max(0, roundMoney(pettyTotals.cashWithMe));
    setNewMonthClosing({
      ...emptyMonthClosing,
      date: getTodayKey(),
      amount: String(settlementAmount),
    });
  }

  function resetExpenseForm() {
    setEditingExpenseId(null);
    setNewExpense({ ...emptyExpense, date: getTodayKey() });
  }

  function openAddCashReceived() {
    resetCashReceivedForm();
    setScreen("addCashReceived");
  }

  function openAddPettyExpense() {
    resetExpenseForm();
    setScreen("addPettyExpense");
  }

  function openAddCashTransfer() {
    resetTransferForm();
    setScreen("addCashTransfer");
  }

  function openPettyMonthClosing() {
    resetMonthClosingForm();
    setScreen("pettyMonthClosing");
  }

  function openEditCashReceived(record) {
    setEditingCashReceivedId(record.id);
    setNewCashReceived({
      date: record.date || getTodayKey(),
      amount: String(record.amount || ""),
      receivedFrom: record.receivedFrom || "Office",
      notes: record.notes || "",
    });
    setScreen("addCashReceived");
  }

  function openEditPettyExpense(expense) {
    setEditingExpenseId(expense.id);
    setNewExpense({
      date: expense.date || getTodayKey(),
      supplier: expense.supplier || "",
      company: expense.company || "",
      branch: expense.branch || "",
      bcBranchCode: expense.bcBranchCode || "",
      itemDescription: expense.itemDescription || "",
      invoiceAmount: String(expense.invoiceAmount || expense.totalAmount || ""),
      vatType: expense.vatType || "VAT Included",
      manualExVat: expense.vatType === "Manual VAT" ? String(expense.amountExVat || "") : "",
      manualVat: expense.vatType === "Manual VAT" ? String(expense.vatAmount || "") : "",
      invoiceNumber: expense.invoiceNumber || "",
      paidBy: expense.paidBy || "",
      notes: expense.notes || "",
    });
    setScreen("addPettyExpense");
  }

  function openEditCashTransfer(transfer) {
    if (transfer.closingId) {
      showAppAlert("Month Closing Transfer", "This transfer was created by Month Closing. Edit or delete the closing from the Month Closing page.");
      return;
    }

    setEditingTransferId(transfer.id);
    setNewTransfer({
      date: transfer.date || getTodayKey(),
      transferType: transfer.transferType || "Transfer Out",
      personName: transfer.personName || "",
      amount: String(transfer.amount || ""),
      purpose: transfer.purpose || "",
      notes: transfer.notes || "",
    });
    setScreen("addCashTransfer");
  }

  function addCashReceived() {
    const amount = toNumber(newCashReceived.amount);
    if (!amount || amount <= 0) {
      showAppAlert("Missing Amount", "Please enter received amount.");
      return;
    }
    const record = {
      id: editingCashReceivedId || Date.now(),
      date: newCashReceived.date || getTodayKey(),
      amount,
      receivedFrom: newCashReceived.receivedFrom.trim() || "Office",
      notes: newCashReceived.notes.trim(),
    };
    if (editingCashReceivedId) {
      setCashReceivedRecords(cashReceivedRecords.map((item) => (item.id === editingCashReceivedId ? record : item)));
    } else {
      setCashReceivedRecords([record, ...cashReceivedRecords]);
    }
    resetCashReceivedForm();
    setScreen("pettyCash");
  }

  function deleteCashReceived(recordId) {
    showAppAlert("Delete Received Cash", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => setCashReceivedRecords(cashReceivedRecords.filter((record) => record.id !== recordId)),
      },
    ]);
  }

  function addCashTransfer() {
    const amount = toNumber(newTransfer.amount);
    if (!newTransfer.personName.trim()) {
      showAppAlert("Missing Name", "Please enter person name.");
      return;
    }
    if (!amount || amount <= 0) {
      showAppAlert("Missing Amount", "Please enter transfer amount.");
      return;
    }
    const transfer = {
      id: editingTransferId || Date.now(),
      date: newTransfer.date || getTodayKey(),
      transferType: newTransfer.transferType,
      personName: newTransfer.personName.trim(),
      amount,
      purpose: newTransfer.purpose.trim(),
      notes: newTransfer.notes.trim(),
    };
    if (editingTransferId) {
      setCashTransfers(cashTransfers.map((item) => (item.id === editingTransferId ? transfer : item)));
    } else {
      setCashTransfers([transfer, ...cashTransfers]);
    }
    resetTransferForm();
    setScreen("pettyCash");
  }

  function deleteCashTransfer(transferId) {
    const transfer = cashTransfers.find((item) => item.id === transferId);

    if (transfer?.closingId) {
      showAppAlert("Month Closing Transfer", "This transfer belongs to a Month Closing record. Delete it from the Month Closing page if required.");
      return;
    }

    showAppAlert("Delete Transfer", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => setCashTransfers(cashTransfers.filter((t) => t.id !== transferId)) },
    ]);
  }

  function savePettyMonthClosing() {
    const settlementAmount = roundMoney(newMonthClosing.amount);
    const expectedAmount = roundMoney(pettyTotals.cashWithMe);
    const settlementTo = normalizeTitleText(newMonthClosing.settlementTo) || "Office";

    if (!newMonthClosing.date) {
      showAppAlert("Missing Date", "Please select closing date.");
      return;
    }

    if (expectedAmount < 0) {
      showAppAlert("Negative Balance", "Cash With Me is negative. Please correct petty cash entries before closing the month.");
      return;
    }

    if (settlementAmount < 0) {
      showAppAlert("Invalid Amount", "Settlement amount cannot be negative.");
      return;
    }

    if (Math.abs(settlementAmount - expectedAmount) > 0.01) {
      showAppAlert(
        "Amount Mismatch",
        `Month Closing amount should match current Cash With Me: ${formatAED(expectedAmount)}. For partial settlement, use Add Cash Transfer instead.`
      );
      return;
    }

    const closingId = Date.now();
    const closingRecord = {
      id: closingId,
      date: newMonthClosing.date,
      settlementTo,
      amount: settlementAmount,
      notes: normalizeTitleText(newMonthClosing.notes),
      createdAt: new Date().toISOString(),
    };

    const nextClosings = [closingRecord, ...pettyClosings];

    if (settlementAmount > 0) {
      const closingTransfer = {
        id: closingId + 1,
        closingId,
        date: newMonthClosing.date,
        transferType: "Transfer Out",
        personName: settlementTo,
        amount: settlementAmount,
        purpose: "Month Closing Settlement",
        notes: closingRecord.notes || "Petty cash month closing",
      };
      setCashTransfers([closingTransfer, ...cashTransfers]);
    }

    setPettyClosings(nextClosings);
    resetMonthClosingForm();
    showAppAlert("Month Closed", "Petty cash period closed successfully. New entries after the closing date will show in the next open period.");
    setScreen("pettyCash");
  }

  function deletePettyMonthClosing(closingId) {
    showAppAlert(
      "Delete Month Closing",
      "Delete this month closing? The linked settlement transfer will also be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPettyClosings(pettyClosings.filter((item) => item.id !== closingId));
            setCashTransfers(cashTransfers.filter((transfer) => transfer.closingId !== closingId));
          },
        },
      ]
    );
  }

  function selectExpenseCompany(company) {
    setNewExpense({ ...newExpense, company, branch: "" });
  }

  function selectExpenseSupplier(supplier) {
    setNewExpense({ ...newExpense, supplier });
  }


  function selectReimbursementCompany(company) {
    setNewReimbursement({ ...newReimbursement, company, branch: "" });
  }

  function addCompanyMaster() {
    const companyName = newCompanyName.trim().toUpperCase();

    if (!companyName) {
      showAppAlert("Missing Company", "Please enter company name.");
      return;
    }

    if (companyBranchesData[companyName]) {
      showAppAlert("Already Exists", "This company already exists.");
      return;
    }

    setCompanyBranchesData({
      ...companyBranchesData,
      [companyName]: [],
    });
    setNewCompanyName("");
    setNewBranchCompany(companyName);
    showAppAlert("Saved", `${companyName} added successfully.`);
  }

  function deleteCompanyMaster(companyName) {
    showAppAlert(
      "Delete Company",
      `Delete ${companyName}? Branches under this company will also be removed. Existing petty cash records will not be changed.`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            const updatedData = { ...companyBranchesData };
            delete updatedData[companyName];
            setCompanyBranchesData(updatedData);

            if (newExpense.company === companyName) {
              setNewExpense({ ...newExpense, company: "", branch: "" });
            }

            if (newReimbursement.company === companyName) {
              setNewReimbursement({ ...newReimbursement, company: "", branch: "" });
            }

            if (newBranchCompany === companyName) {
              const nextCompany = Object.keys(updatedData)[0] || "";
              setNewBranchCompany(nextCompany);
            }

            if (newBcBranchEntity === companyName) {
              setNewBcBranchEntity("");
            }
          },
        },
      ]
    );
  }

  function addBranchMaster() {
    const companyName = newBranchCompany.trim();
    const branchName = newBranchName.trim().toUpperCase();

    if (!companyName) {
      showAppAlert("Missing Company", "Please select company first.");
      return;
    }

    if (!branchName) {
      showAppAlert("Missing Branch", "Please enter branch name.");
      return;
    }

    const existingBranches = companyBranchesData[companyName] || [];
    const alreadyExists = existingBranches.some(
      (branch) => branch.toLowerCase() === branchName.toLowerCase()
    );

    if (alreadyExists) {
      showAppAlert("Already Exists", "This branch already exists under selected company.");
      return;
    }

    setCompanyBranchesData({
      ...companyBranchesData,
      [companyName]: [...existingBranches, branchName].sort((a, b) => a.localeCompare(b)),
    });
    setNewBranchName("");
    showAppAlert("Saved", `${branchName} added under ${companyName}.`);
  }

  function deleteBranchMaster(companyName, branchName) {
    showAppAlert("Delete Branch", `Delete ${branchName} from ${companyName}?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          const existingBranches = companyBranchesData[companyName] || [];
          setCompanyBranchesData({
            ...companyBranchesData,
            [companyName]: existingBranches.filter((branch) => branch !== branchName),
          });

          if (newExpense.company === companyName && newExpense.branch === branchName) {
            setNewExpense({ ...newExpense, branch: "" });
          }


          if (newReimbursement.company === companyName && newReimbursement.branch === branchName) {
            setNewReimbursement({ ...newReimbursement, branch: "" });
          }
        },
      },
    ]);
  }

  function addBcBranchMaster() {
    const entityName = newBcBranchEntity.trim().toUpperCase();
    const branchCode = newBcBranchCode.trim().toUpperCase();
    const displayName = normalizeTitleText(newBcBranchName);

    if (!entityName) {
      showAppAlert("Missing Entity", "Please enter Entity / Brand.");
      return;
    }

    if (!branchCode) {
      showAppAlert("Missing BC Branch Code", "Please enter BC Branch / Entity Code.");
      return;
    }

    const alreadyExists = bcBranchList.some(
      (item) => item.code.toLowerCase() === branchCode.toLowerCase()
    );

    if (alreadyExists) {
      showAppAlert("Already Exists", "This BC Branch code already exists.");
      return;
    }

    const newItem = {
      id: `bc-${Date.now()}`,
      entity: entityName,
      code: branchCode,
      name: displayName || branchCode,
    };

    setBcBranchData([...bcBranchList, newItem].sort((a, b) => a.code.localeCompare(b.code)));
    setNewBcBranchCode("");
    setNewBcBranchName("");
    showAppAlert("Saved", `${branchCode} added successfully.`);
  }

  function deleteBcBranchMaster(code) {
    showAppAlert(
      "Delete BC Branch Code",
      `Delete ${code}? Existing petty cash/reimbursement records will not be changed.`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            setBcBranchData(bcBranchList.filter((item) => item.code !== code));

            if (newExpense.bcBranchCode === code) {
              setNewExpense({ ...newExpense, bcBranchCode: "" });
            }

            if (newReimbursement.bcBranchCode === code) {
              setNewReimbursement({ ...newReimbursement, bcBranchCode: "" });
            }
          },
        },
      ]
    );
  }

  async function loadBuiltInBcBranchMaster() {
    showAppAlert(
      "Load Built-in Master",
      `This will replace BC Branch master data with the built-in ${DEFAULT_BC_BRANCH_CODES.length} branch codes from your uploaded master file. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load",
          onPress: () => {
            setBcBranchData(mergeBcBranchData(DEFAULT_BC_BRANCH_CODES));
            showAppAlert("Loaded", `${DEFAULT_BC_BRANCH_CODES.length} BC branch codes loaded successfully.`);
          },
        },
      ]
    );
  }

  async function importBcBranchExcel() {
    appStateLockBypassUntilRef.current = Date.now() + 120000;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/octet-stream",
          "*/*",
        ],
        copyToCacheDirectory: true,
      });

      appStateLockBypassUntilRef.current = Date.now() + 6000;

      if (result.canceled || result.type === "cancel") {
        return;
      }

      const selectedFile = result.assets?.[0] || result;
      const fileUri = selectedFile.uri;

      if (!fileUri) {
        showAppAlert("Import Failed", "No Excel file was selected.");
        return;
      }

      const fileBase64 = await readPickedFileAsBase64(fileUri, selectedFile, "bc_branch_master");
      const workbook = readWorkbookFromBase64(fileBase64);

      const sheetName = workbook.SheetNames.includes("Dimension Values")
        ? "Dimension Values"
        : workbook.SheetNames[0];

      if (!sheetName) {
        showAppAlert("Import Failed", "No sheet was found in this Excel file.");
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
      const importedBranches = parseBcBranchExcelRows(rows);

      if (importedBranches.length === 0) {
        showAppAlert(
          "Import Failed",
          "No valid BC branch codes found. Excel must have Code and Name columns."
        );
        return;
      }

      showAppAlert(
        "Import BC Branch Codes",
        `Found ${importedBranches.length} BC branch codes from ${selectedFile.name || "selected Excel"}. How do you want to save them?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Merge",
            onPress: () => {
              const mergedMap = new Map();
              [...bcBranchData, ...importedBranches].forEach((item) => {
                const normalized = normalizeBcBranchData([item])[0];
                if (normalized) mergedMap.set(normalized.code, normalized);
              });
              const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
                const entityCompare = a.entity.localeCompare(b.entity);
                return entityCompare !== 0 ? entityCompare : a.code.localeCompare(b.code);
              });
              setBcBranchData(mergedList);
              showAppAlert("Import Completed", `${importedBranches.length} BC branch codes merged successfully.`);
            },
          },
          {
            text: "Replace",
            style: "destructive",
            onPress: () => {
              setBcBranchData(importedBranches);
              showAppAlert("Import Completed", `${importedBranches.length} BC branch codes imported successfully.`);
            },
          },
        ]
      );
    } catch (error) {
      console.log("BC branch Excel import error:", error);
      showAppAlert(
        "Import Failed",
        `Could not import this Excel file in Expo. Reason: ${getShortErrorMessage(error)}\n\nUse Load Built-in Master instead. Your uploaded 128 branch codes are already included in this app version.`
      );
    } finally {
      appStateLockBypassUntilRef.current = Date.now() + 4000;
    }
  }

  function addSupplierMaster() {
    const supplierName = normalizeTitleText(newSupplierName);

    if (!supplierName) {
      showAppAlert("Missing Supplier", "Please enter supplier name.");
      return;
    }

    const alreadyExists = supplierData.some(
      (supplier) => supplier.toLowerCase() === supplierName.toLowerCase()
    );

    if (alreadyExists) {
      showAppAlert("Already Exists", "This supplier already exists.");
      return;
    }

    setSupplierData([...supplierData, supplierName].sort((a, b) => a.localeCompare(b)));
    setNewSupplierName("");
    showAppAlert("Saved", `${supplierName} added successfully.`);
  }

  function deleteSupplierMaster(supplierName) {
    showAppAlert(
      "Delete Supplier",
      `Delete ${supplierName}? Existing petty cash records will not be changed.`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            setSupplierData(supplierData.filter((supplier) => supplier !== supplierName));
            if (newExpense.supplier === supplierName) {
              setNewExpense({ ...newExpense, supplier: "" });
            }
          },
        },
      ]
    );
  }

  function addPettyExpense() {
    const amounts = calculateExpenseAmounts(newExpense);
    if (!newExpense.supplier.trim()) return showAppAlert("Missing Supplier", "Please enter supplier name.");
    if (!newExpense.company.trim()) return showAppAlert("Missing Company", "Please select company.");
    if (!newExpense.branch.trim()) return showAppAlert("Missing Branch", "Please select branch.");
    if (!newExpense.itemDescription.trim()) return showAppAlert("Missing Item", "Please enter item description.");
    if (!amounts.totalAmount || amounts.totalAmount <= 0) return showAppAlert("Missing Amount", "Please enter invoice amount.");

    const expense = {
      id: editingExpenseId || Date.now(),
      date: newExpense.date || getTodayKey(),
      supplier: newExpense.supplier.trim(),
      company: newExpense.company.trim(),
      branch: newExpense.branch.trim(),
      bcBranchCode: newExpense.bcBranchCode.trim().toUpperCase(),
      itemDescription: newExpense.itemDescription.trim(),
      invoiceAmount: amounts.invoiceAmount,
      vatType: newExpense.vatType,
      amountExVat: amounts.amountExVat,
      vatAmount: amounts.vatAmount,
      totalAmount: amounts.totalAmount,
      invoiceNumber: newExpense.invoiceNumber.trim(),
      paidBy: newExpense.paidBy.trim(),
      notes: newExpense.notes.trim(),
    };

    if (editingExpenseId) {
      setPettyCashExpenses(pettyCashExpenses.map((item) => (item.id === editingExpenseId ? expense : item)));
    } else {
      setPettyCashExpenses([expense, ...pettyCashExpenses]);
    }
    resetExpenseForm();
    setScreen("pettyCash");
  }

  function deletePettyExpense(expenseId) {
    showAppAlert("Delete Expense", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => setPettyCashExpenses(pettyCashExpenses.filter((e) => e.id !== expenseId)) },
    ]);
  }

  function movePettyReportMonth(direction) {
    const nextDate = new Date(pettyReportMonth.year, pettyReportMonth.monthIndex + direction, 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();
    const nextRange = getMonthDateRange(nextYear, nextMonth);
    setPettyReportMonth({ year: nextYear, monthIndex: nextMonth });
    setPettyReportFromDate(nextRange.from);
    setPettyReportToDate(nextRange.to);
  }

  async function exportPettyCashExcel() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(pettyReportFromDate, pettyReportToDate);
      const safeMonthTitle = sanitizeExportFileName(rangeTitle);
      const workbook = XLSX.utils.book_new();

      const reportRows = [
        ["PETTY CASH REPORT", rangeTitle],
        [],
        ["Summary", "Amount"],
        ["Opening Book Balance", pettyReport.openingBookBalance],
        ["Amount Received", pettyReport.monthReceived],
        ["Total Expenses", pettyReport.monthSpent],
        ["Transfer Out", pettyReport.monthTransferOut],
        ["Transfer In", pettyReport.monthTransferIn],
        ["Closing Book Balance", pettyReport.closingBookBalance],
        ["Cash In Transfer", pettyReport.closingCashInTransfer],
        ["Cash With Me", pettyReport.closingCashWithMe],
        [],
        [
          "Date",
          "Supplier",
          "Spend for: Branch",
          "Item Description",
          "Spend for: Company",
          "Invoice Amount",
          "Amount Ex.VAT",
          "VAT (5%)",
          "Amount",
          "Paid By",
          "Invoice No",
          "Notes",
        ],
      ];

      pettyReport.expenses.forEach((expense) => {
        reportRows.push([
          formatDateForDisplay(expense.date),
          expense.supplier || "",
          expense.branch || "",
          expense.itemDescription || "",
          expense.company || "",
          toNumber(expense.invoiceAmount),
          toNumber(expense.amountExVat),
          toNumber(expense.vatAmount),
          toNumber(expense.totalAmount),
          expense.paidBy || "",
          expense.invoiceNumber || "",
          expense.notes || "",
        ]);
      });

      const totalInvoice = pettyReport.expenses.reduce((sum, expense) => sum + toNumber(expense.invoiceAmount), 0);
      const totalExVat = pettyReport.expenses.reduce((sum, expense) => sum + toNumber(expense.amountExVat), 0);
      const totalVat = pettyReport.expenses.reduce((sum, expense) => sum + toNumber(expense.vatAmount), 0);
      const totalAmount = pettyReport.expenses.reduce((sum, expense) => sum + toNumber(expense.totalAmount), 0);
      reportRows.push([]);
      reportRows.push(["", "", "", "", "TOTAL", roundMoney(totalInvoice), roundMoney(totalExVat), roundMoney(totalVat), roundMoney(totalAmount), "", "", ""]);

      const reportSheet = XLSX.utils.aoa_to_sheet(reportRows);
      reportSheet["!cols"] = [
        { wch: 14 },
        { wch: 26 },
        { wch: 22 },
        { wch: 32 },
        { wch: 22 },
        { wch: 16 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
        { wch: 18 },
        { wch: 18 },
        { wch: 30 },
      ];
      XLSX.utils.book_append_sheet(workbook, reportSheet, "Petty Cash Report");

      const receivedRows = [
        ["Date", "Received From", "Amount", "Notes"],
        ...pettyReport.received.map((record) => [
          formatDateForDisplay(record.date),
          record.receivedFrom || "",
          toNumber(record.amount),
          record.notes || "",
        ]),
      ];
      const receivedSheet = XLSX.utils.aoa_to_sheet(receivedRows);
      receivedSheet["!cols"] = [{ wch: 14 }, { wch: 24 }, { wch: 14 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(workbook, receivedSheet, "Received Cash");

      const transferRows = [
        ["Date", "Transfer Type", "Person Name", "Purpose", "Amount", "Notes"],
        ...pettyReport.transfers.map((transfer) => [
          formatDateForDisplay(transfer.date),
          transfer.transferType || "",
          transfer.personName || "",
          transfer.purpose || "",
          toNumber(transfer.amount),
          transfer.notes || "",
        ]),
      ];
      const transferSheet = XLSX.utils.aoa_to_sheet(transferRows);
      transferSheet["!cols"] = [{ wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 32 }, { wch: 14 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(workbook, transferSheet, "Cash Transfers");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_Petty_Cash_${safeMonthTitle}`,
        "Share Petty Cash Excel Report"
      );
    } catch (error) {
      console.log("Excel export error:", error);
      showAppAlert("Export Failed", "Excel export failed. Send me the error screenshot if it repeats.");
    }
  }


  async function exportPettyCashBcExcel() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(pettyReportFromDate, pettyReportToDate);
      const safeMonthTitle = sanitizeExportFileName(rangeTitle);

      const rows = buildPettyCashBcRows(pettyReport.expenses, profileData);
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet(rows);
      sheet["!cols"] = getBcColumnWidths();
      XLSX.utils.book_append_sheet(workbook, sheet, "Lines");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_BC_Petty_Cash_${safeMonthTitle}`,
        "Share BC Petty Cash Excel"
      );
    } catch (error) {
      console.log("BC petty cash export error:", error);
      showAppAlert("Export Failed", "BC Petty Cash Excel export failed. Send me the error screenshot if it repeats.");
    }
  }



  function resetReimbursementForm() {
    setEditingReimbursementId(null);
    setNewReimbursement({ ...emptyReimbursement, date: getTodayKey() });
  }

  function resetReimbursementClaimForm() {
    const fallbackRange = getDefaultClaimDateRange();
    setNewReimbursementClaim({
      ...emptyReimbursementClaim,
      fromDate: reimbursementReportFromDate || fallbackRange.from,
      toDate: reimbursementReportToDate || fallbackRange.to,
      submitDate: getTodayKey(),
      submittedTo: "Rahim",
    });
  }

  function openAddReimbursement() {
    resetReimbursementForm();
    setScreen("addReimbursement");
  }

  function openReimbursementClaimSettlement() {
    resetReimbursementClaimForm();
    setScreen("reimbursementClaimSettlement");
  }

  function openEditReimbursement(record) {
    if (record.claimId) {
      showAppAlert("Claim Linked Record", "This reimbursement is already linked to a submitted claim. Delete the claim first if you need to change this record.");
      return;
    }

    setEditingReimbursementId(record.id);
    setNewReimbursement({
      date: record.date || getTodayKey(),
      company: record.company || "",
      branch: record.branch || "",
      bcBranchCode: record.bcBranchCode || "",
      purpose: record.purpose || "",
      expenseType: record.expenseType || "Parking",
      amount: String(record.amount || ""),
      receiptNo: record.receiptNo || "",
      notes: record.notes || "",
      status: record.status || "Pending",
    });
    setScreen("addReimbursement");
  }

  function saveReimbursementRecord() {
    const amount = toNumber(newReimbursement.amount);

    if (!newReimbursement.date.trim()) {
      showAppAlert("Missing Date", "Please enter date.");
      return;
    }

    if (!newReimbursement.company.trim()) {
      showAppAlert("Missing Company", "Please select company.");
      return;
    }

    if (!newReimbursement.branch.trim()) {
      showAppAlert("Missing Branch", "Please select or type branch.");
      return;
    }

    if (!newReimbursement.purpose.trim()) {
      showAppAlert("Missing Purpose", "Please enter reason or purpose of expense.");
      return;
    }

    if (!amount || amount <= 0) {
      showAppAlert("Missing Amount", "Please enter expense amount.");
      return;
    }

    const record = {
      id: editingReimbursementId || Date.now(),
      date: newReimbursement.date.trim(),
      company: newReimbursement.company.trim(),
      branch: newReimbursement.branch.trim(),
      bcBranchCode: newReimbursement.bcBranchCode.trim().toUpperCase(),
      purpose: newReimbursement.purpose.trim(),
      expenseType: newReimbursement.expenseType || "Parking",
      amount: roundMoney(amount),
      receiptNo: newReimbursement.receiptNo.trim(),
      notes: newReimbursement.notes.trim(),
      status: newReimbursement.status || "Pending",
    };

    if (editingReimbursementId) {
      setReimbursementRecords(
        reimbursementRecords.map((item) => (item.id === editingReimbursementId ? record : item))
      );
    } else {
      setReimbursementRecords([record, ...reimbursementRecords]);
    }

    resetReimbursementForm();
    setScreen("reimbursement");
  }

  function deleteReimbursementRecord(recordId) {
    const record = reimbursementRecords.find((item) => item.id === recordId);

    if (record?.claimId) {
      showAppAlert("Claim Linked Record", "This reimbursement is already linked to a submitted claim. Delete the claim first if you need to remove this record.");
      return;
    }

    showAppAlert("Delete Reimbursement", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => setReimbursementRecords(reimbursementRecords.filter((record) => record.id !== recordId)),
      },
    ]);
  }

  function getNextReimbursementClaimNo(submitDate) {
    const dateKey = String(submitDate || getTodayKey()).replace(/-/g, "");
    const existingCount = reimbursementClaims.filter((claim) => String(claim.submitDate || "").replace(/-/g, "") === dateKey).length;
    return `CLAIM-${dateKey}-${String(existingCount + 1).padStart(3, "0")}`;
  }

  function submitReimbursementClaim() {
    const fromDate = newReimbursementClaim.fromDate;
    const toDate = newReimbursementClaim.toDate;
    const submitDate = newReimbursementClaim.submitDate || getTodayKey();
    const submittedTo = normalizeTitleText(newReimbursementClaim.submittedTo) || "Rahim";

    if (!fromDate || !toDate) {
      showAppAlert("Missing Date Range", "Please select claim From Date and To Date.");
      return;
    }

    if (String(fromDate) > String(toDate)) {
      showAppAlert("Invalid Date Range", "From Date cannot be greater than To Date.");
      return;
    }

    if (!submitDate) {
      showAppAlert("Missing Submit Date", "Please select submit date.");
      return;
    }

    const eligibleRecords = reimbursementRecords.filter((record) => {
      const recordStatus = record.status || "Pending";
      return isDateInRange(record.date, fromDate, toDate) && recordStatus === "Pending" && !record.claimId;
    });

    if (eligibleRecords.length === 0) {
      showAppAlert("No Pending Records", "No pending reimbursement records are available in this claim period.");
      return;
    }

    const claimReport = getReimbursementReportByDateRange(eligibleRecords, fromDate, toDate);
    const claimId = Date.now();
    const claimNo = getNextReimbursementClaimNo(submitDate);
    const recordIds = eligibleRecords.map((record) => record.id);

    const claim = {
      id: claimId,
      claimNo,
      fromDate,
      toDate,
      submitDate,
      submittedTo,
      status: "Submitted",
      totalAmount: claimReport.totalClaim,
      totalTransportation: claimReport.totalTransportation,
      foodAccommodationTotal: claimReport.foodAccommodationTotal,
      parkingSalikTotal: claimReport.parkingSalikTotal,
      otherTransportationTotal: claimReport.otherTransportationTotal,
      recordCount: eligibleRecords.length,
      recordIds,
      notes: normalizeTitleText(newReimbursementClaim.notes),
      createdAt: new Date().toISOString(),
    };

    setReimbursementClaims([claim, ...reimbursementClaims]);
    setReimbursementRecords(
      reimbursementRecords.map((record) => (
        recordIds.includes(record.id)
          ? { ...record, status: "Submitted", claimId, claimNo }
          : record
      ))
    );

    showAppAlert("Claim Submitted", `${claimNo} submitted successfully with ${eligibleRecords.length} records.`);
    setScreen("reimbursement");
  }

  function markReimbursementClaimReimbursed(claimId) {
    const claim = reimbursementClaims.find((item) => item.id === claimId);
    if (!claim) return;

    showAppAlert(
      "Mark Reimbursed",
      `Mark ${claim.claimNo} as reimbursed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Reimbursed",
          onPress: () => {
            setReimbursementClaims(
              reimbursementClaims.map((item) => (
                item.id === claimId
                  ? { ...item, status: "Reimbursed", reimbursedDate: getTodayKey() }
                  : item
              ))
            );
            setReimbursementRecords(
              reimbursementRecords.map((record) => (
                record.claimId === claimId
                  ? { ...record, status: "Reimbursed" }
                  : record
              ))
            );
          },
        },
      ]
    );
  }

  function deleteReimbursementClaim(claimId) {
    const claim = reimbursementClaims.find((item) => item.id === claimId);
    if (!claim) return;

    showAppAlert(
      "Delete Claim",
      `Delete ${claim.claimNo}? Linked reimbursement records will return to Pending status.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setReimbursementClaims(reimbursementClaims.filter((item) => item.id !== claimId));
            setReimbursementRecords(
              reimbursementRecords.map((record) => (
                record.claimId === claimId
                  ? {
                      ...record,
                      status: "Pending",
                      claimId: undefined,
                      claimNo: undefined,
                    }
                  : record
              ))
            );
          },
        },
      ]
    );
  }

  function moveReimbursementReportMonth(direction) {
    const nextDate = new Date(
      reimbursementReportMonth.year,
      reimbursementReportMonth.monthIndex + direction,
      1
    );
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();
    const nextRange = getClaimDateRangeForMonth(nextYear, nextMonth);
    setReimbursementReportMonth({
      year: nextYear,
      monthIndex: nextMonth,
    });
    setReimbursementReportFromDate(nextRange.from);
    setReimbursementReportToDate(nextRange.to);
  }

  async function exportReimbursementExcel() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(reimbursementReportFromDate, reimbursementReportToDate);
      const safeMonthTitle = sanitizeExportFileName(rangeTitle);
      const workbook = XLSX.utils.book_new();

      const reportRows = [
        ["TRANSPORTATION / REIMBURSEMENT REPORT", rangeTitle],
        [],
        ["Summary", "Amount"],
        ["Parking / Salik", reimbursementReport.parkingSalikTotal],
        ["Other Transportation", reimbursementReport.otherTransportationTotal],
        ["Total Transportation", reimbursementReport.totalTransportation],
        ["Food & Accommodation", reimbursementReport.foodAccommodationTotal],
        ["Total Claim", reimbursementReport.totalClaim],
        [],
        [
          "Date",
          "Description/Purpose/Reason of Expense",
          "Parking / Salik",
          "Total Transportation",
          "Food & Accommodation",
          "Company",
          "Branch",
          "Expense Type",
          "Receipt / Ticket No",
          "Status",
          "Notes",
        ],
      ];

      appendReimbursementReportSection(reportRows, "Parking / Salik / Transportation Expenses", reimbursementReport.transportRecords);
      appendReimbursementReportSection(reportRows, "Food & Accommodation Expenses", reimbursementReport.foodRecords);

      reportRows.push([]);
      reportRows.push([
        "",
        "TOTAL",
        reimbursementReport.parkingSalikTotal,
        reimbursementReport.totalTransportation,
        reimbursementReport.foodAccommodationTotal,
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      const reportSheet = XLSX.utils.aoa_to_sheet(reportRows);
      reportSheet["!cols"] = [
        { wch: 16 },
        { wch: 48 },
        { wch: 18 },
        { wch: 22 },
        { wch: 22 },
        { wch: 16 },
        { wch: 22 },
        { wch: 20 },
        { wch: 22 },
        { wch: 16 },
        { wch: 32 },
      ];

      XLSX.utils.book_append_sheet(workbook, reportSheet, "Reimbursement");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_Reimbursement_${safeMonthTitle}`,
        "Share Reimbursement Excel Report"
      );
    } catch (error) {
      console.log("Reimbursement export error:", error);
      showAppAlert("Export Failed", "Reimbursement Excel export failed. Send me the error screenshot if it repeats.");
    }
  }


  async function exportReimbursementBcExcel() {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(reimbursementReportFromDate, reimbursementReportToDate);
      const safeMonthTitle = sanitizeExportFileName(rangeTitle);

      const rows = buildReimbursementBcRows(reimbursementReport.orderedRecords, profileData);
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet(rows);
      sheet["!cols"] = getReimbursementBcColumnWidths();
      XLSX.utils.book_append_sheet(workbook, sheet, "Lines");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_BC_Reimbursement_${safeMonthTitle}`,
        "Share BC Reimbursement Excel"
      );
    } catch (error) {
      console.log("BC reimbursement export error:", error);
      showAppAlert("Export Failed", "BC Reimbursement Excel export failed. Send me the error screenshot if it repeats.");
    }
  }

  async function exportReimbursementClaimExcel() {
    try {
      if (reimbursementClaimEligibleReport.records.length === 0) {
        showAppAlert("No Pending Records", "No pending reimbursement records are available for export in this claim period.");
        return;
      }

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(newReimbursementClaim.fromDate, newReimbursementClaim.toDate);
      const safeRangeTitle = sanitizeExportFileName(rangeTitle);
      const workbook = XLSX.utils.book_new();

      const reportRows = [
        ["REIMBURSEMENT CLAIM SUBMISSION", rangeTitle],
        ["Submit Date", formatDateForDisplay(newReimbursementClaim.submitDate)],
        ["Submitted To", newReimbursementClaim.submittedTo || "Rahim"],
        [],
        ["Summary", "Amount"],
        ["Parking / Salik", reimbursementClaimEligibleReport.parkingSalikTotal],
        ["Other Transportation", reimbursementClaimEligibleReport.otherTransportationTotal],
        ["Total Transportation", reimbursementClaimEligibleReport.totalTransportation],
        ["Food & Accommodation", reimbursementClaimEligibleReport.foodAccommodationTotal],
        ["Total Claim", reimbursementClaimEligibleReport.totalClaim],
        [],
        [
          "Date",
          "Description/Purpose/Reason of Expense",
          "Parking / Salik",
          "Total Transportation",
          "Food & Accommodation",
          "Company",
          "Branch",
          "BC Branch Code",
          "Expense Type",
          "Receipt / Ticket No",
          "Status",
          "Notes",
        ],
      ];

      appendReimbursementClaimReportSection(reportRows, "Parking / Salik / Transportation Expenses", reimbursementClaimEligibleReport.transportRecords);
      appendReimbursementClaimReportSection(reportRows, "Food & Accommodation Expenses", reimbursementClaimEligibleReport.foodRecords);

      reportRows.push([]);
      reportRows.push([
        "",
        "TOTAL",
        reimbursementClaimEligibleReport.parkingSalikTotal,
        reimbursementClaimEligibleReport.totalTransportation,
        reimbursementClaimEligibleReport.foodAccommodationTotal,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      const reportSheet = XLSX.utils.aoa_to_sheet(reportRows);
      reportSheet["!cols"] = [
        { wch: 16 },
        { wch: 48 },
        { wch: 18 },
        { wch: 22 },
        { wch: 22 },
        { wch: 16 },
        { wch: 22 },
        { wch: 18 },
        { wch: 20 },
        { wch: 22 },
        { wch: 16 },
        { wch: 32 },
      ];

      XLSX.utils.book_append_sheet(workbook, reportSheet, "Claim");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_Reimbursement_Claim_${safeRangeTitle}`,
        "Share Reimbursement Claim Excel"
      );
    } catch (error) {
      console.log("Reimbursement claim export error:", error);
      showAppAlert("Export Failed", "Reimbursement claim Excel export failed. Send me the error screenshot if it repeats.");
    }
  }

  async function exportReimbursementClaimBcExcel() {
    try {
      if (reimbursementClaimEligibleReport.records.length === 0) {
        showAppAlert("No Pending Records", "No pending reimbursement records are available for BC export in this claim period.");
        return;
      }

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        showAppAlert("Sharing Not Available", "Sharing is not available on this device.");
        return;
      }

      const rangeTitle = getDateRangeTitle(newReimbursementClaim.fromDate, newReimbursementClaim.toDate);
      const safeRangeTitle = sanitizeExportFileName(rangeTitle);

      const rows = buildReimbursementBcRows(reimbursementClaimEligibleReport.orderedRecords, profileData);
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet(rows);
      sheet["!cols"] = getReimbursementBcColumnWidths();
      XLSX.utils.book_append_sheet(workbook, sheet, "Lines");

      await writeWorkbookAndShare(
        workbook,
        `DailyTask_BC_Reimbursement_Claim_${safeRangeTitle}`,
        "Share BC Reimbursement Claim Excel"
      );
    } catch (error) {
      console.log("BC reimbursement claim export error:", error);
      showAppAlert("Export Failed", "BC Reimbursement Claim Excel export failed. Send me the error screenshot if it repeats.");
    }
  }

  if (!isStorageReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#EEF5F7" />
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingTitle}>DailyTask</Text>
          <Text style={styles.loadingText}>Loading saved data...</Text>
        </View>
        <AppAlertHost />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn && screen === "welcome") {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E3B43" />

        <View style={styles.modernWelcomeScreen}>
          <Animated.View
            style={[
              styles.motionBlobOne,
              {
                transform: [
                  {
                    translateY: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -18],
                    }),
                  },
                  {
                    translateX: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 12],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.motionBlobTwo,
              {
                transform: [
                  {
                    translateY: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }),
                  },
                  {
                    translateX: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -14],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.motionBlobThree,
              {
                transform: [
                  {
                    translateY: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.View style={[styles.welcomeContentWrap, { opacity: fadeAnim }]}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>DailyTask</Text>
            </View>

            <Animated.View
              style={[
                styles.heroLogoCircle,
                {
                  transform: [
                    {
                      scale: logoPulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.04],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.heroLogoText}>✓</Text>
            </Animated.View>

            <Text style={styles.heroTitle}>Daily work, neatly managed</Text>

            <Text style={styles.heroSubtitle}>
              Attendance, tasks, petty cash and reimbursement in one simple app.
            </Text>

            <View style={styles.featureChipRow}>
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>Attendance</Text>
              </View>
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>Petty Cash</Text>
              </View>
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>Reimbursement</Text>
              </View>
            </View>

            <Pressable
              style={styles.heroGetStartedButton}
              onPress={() => setScreen("login")}
            >
              <Text style={styles.heroGetStartedButtonText}>Get Started</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.poweredBadge}>
            <Text style={styles.poweredBadgeSmall}>Powered by</Text>
            <Text style={styles.poweredBadgeName}>Crescent IT Solution</Text>
          </View>

        </View>
        <AppAlertHost />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn && screen === "login") {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E3B43" />

        <KeyboardAvoidingView
          style={styles.modernLoginScreen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[
              styles.loginBlobOne,
              {
                transform: [
                  {
                    translateY: floatAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.loginBlobTwo,
              {
                transform: [
                  {
                    translateY: floatAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 18],
                    }),
                  },
                ],
              },
            ]}
          />

          <Pressable style={styles.modernBackButton} onPress={goBack}>
            <Text style={styles.modernBackButtonText}>‹</Text>
          </Pressable>

          <ScrollView
            style={styles.loginScroll}
            contentContainerStyle={styles.loginScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.loginHeroWrap, { opacity: fadeAnim }]}>
              <Text style={styles.loginTopMini}>Welcome Back</Text>
              <Text style={styles.loginHeroTitle}>Login to DailyTask</Text>
              <Text style={styles.loginHeroSub}>
                Continue your daily work tracking with a clean dashboard.
              </Text>
            </Animated.View>

            <Animated.View style={[styles.modernLoginCard, { opacity: fadeAnim }]}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.modernInput}
                placeholder="Enter username"
                placeholderTextColor="#8BA2A8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                ref={passwordInputRef}
                style={styles.modernInput}
                placeholder="Enter password"
                placeholderTextColor="#8BA2A8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handlePasswordSubmit}
              />

              <Pressable style={styles.modernLoginButton} onPress={handleLogin}>
                <Text style={styles.modernLoginButtonText}>Login</Text>
              </Pressable>

              {biometricEnabled ? (
                <Pressable style={styles.biometricLoginButton} onPress={loginWithBiometric}>
                  <Text style={styles.biometricLoginIcon}>🔐</Text>
                  <Text style={styles.biometricLoginText}>Login with Biometric</Text>
                </Pressable>
              ) : null}

              <View style={styles.authLinkRow}>
                <Pressable style={styles.authLinkButton} onPress={openForgotPasswordRecovery}>
                  <Text style={styles.authLinkText}>Forgot password?</Text>
                </Pressable>
                <Text style={styles.authLinkDivider}>|</Text>
                <Pressable style={styles.authLinkButton} onPress={openSignUpPage}>
                  <Text style={styles.authLinkText}>New User? Sign Up</Text>
                </Pressable>
              </View>

            </Animated.View>

          </ScrollView>

          {!isKeyboardVisible ? (
            <View style={styles.loginPoweredBadge}>
              <Text style={styles.poweredBadgeSmall}>Powered by</Text>
              <Text style={styles.poweredBadgeName}>Crescent IT Solution</Text>
            </View>
          ) : null}

        </KeyboardAvoidingView>
        <AppAlertHost />
      </SafeAreaView>
    );
  }


  if (!isLoggedIn && screen === "signup") {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E3B43" />
        <KeyboardAvoidingView
          style={styles.modernLoginScreen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View style={[styles.loginBlobOne, { opacity: 0.9 }]} />
          <Animated.View style={[styles.loginBlobTwo, { opacity: 0.9 }]} />

          <Pressable style={styles.modernBackButton} onPress={() => setScreen("login")}>
            <Text style={styles.modernBackButtonText}>‹</Text>
          </Pressable>

          <ScrollView
            style={styles.loginScroll}
            contentContainerStyle={styles.loginScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.loginHeroWrap, { opacity: fadeAnim }]}>
              <Text style={styles.loginTopMini}>New User Setup</Text>
              <Text style={styles.loginHeroTitle}>Create Account</Text>
              <Text style={styles.loginHeroSub}>
                Create your own local username and password. Recovery phone or email is required for forgot password.
              </Text>
            </Animated.View>

            <Animated.View style={[styles.modernLoginCard, { opacity: fadeAnim }]}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.modernInput}
                placeholder="Create username"
                placeholderTextColor="#8BA2A8"
                value={signupForm.username}
                onChangeText={(text) => setSignupForm({ ...signupForm, username: text })}
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => signupPasswordInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                ref={signupPasswordInputRef}
                style={styles.modernInput}
                placeholder="Create password"
                placeholderTextColor="#8BA2A8"
                value={signupForm.password}
                onChangeText={(text) => setSignupForm({ ...signupForm, password: text })}
                secureTextEntry
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => signupConfirmPasswordInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                ref={signupConfirmPasswordInputRef}
                style={styles.modernInput}
                placeholder="Re-enter password"
                placeholderTextColor="#8BA2A8"
                value={signupForm.confirmPassword}
                onChangeText={(text) => setSignupForm({ ...signupForm, confirmPassword: text })}
                secureTextEntry
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => signupPhoneInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Recovery Phone Number</Text>
              <TextInput
                ref={signupPhoneInputRef}
                style={styles.modernInput}
                placeholder="Enter phone number"
                placeholderTextColor="#8BA2A8"
                value={signupForm.recoveryPhone}
                onChangeText={(text) => setSignupForm({ ...signupForm, recoveryPhone: text })}
                keyboardType="phone-pad"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => signupEmailInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Recovery Email ID</Text>
              <TextInput
                ref={signupEmailInputRef}
                style={styles.modernInput}
                placeholder="Enter email ID"
                placeholderTextColor="#8BA2A8"
                value={signupForm.recoveryEmail}
                onChangeText={(text) => setSignupForm({ ...signupForm, recoveryEmail: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={createLocalAccount}
              />

              <Text style={styles.loginHelperText}>
                Phone or email is mandatory. You can enter both for safer recovery.
              </Text>

              <Pressable style={styles.modernLoginButton} onPress={createLocalAccount}>
                <Text style={styles.modernLoginButtonText}>Create Account</Text>
              </Pressable>

              <Pressable style={styles.forgotPasswordButton} onPress={() => setScreen("login")}>
                <Text style={styles.forgotPasswordText}>Back to Login</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.loginPoweredBadgeInline}>
              <Text style={styles.poweredBadgeSmall}>Powered by</Text>
              <Text style={styles.poweredBadgeName}>Crescent IT Solution</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <AppAlertHost />
      </SafeAreaView>
    );
  }


  if (!isLoggedIn && screen === "forgotPassword") {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E3B43" />
        <KeyboardAvoidingView
          style={styles.modernLoginScreen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View style={[styles.loginBlobOne, { opacity: 0.9 }]} />
          <Animated.View style={[styles.loginBlobTwo, { opacity: 0.9 }]} />

          <Pressable style={styles.modernBackButton} onPress={() => setScreen("login")}>
            <Text style={styles.modernBackButtonText}>‹</Text>
          </Pressable>

          <ScrollView
            style={styles.loginScroll}
            contentContainerStyle={styles.loginScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.loginHeroWrap, { opacity: fadeAnim }]}>
              <Text style={styles.loginTopMini}>Account Recovery</Text>
              <Text style={styles.loginHeroTitle}>Reset Password</Text>
              <Text style={styles.loginHeroSub}>
                Verify using the phone number or email ID saved in your profile, then set a new local password.
              </Text>
            </Animated.View>

            <Animated.View style={[styles.modernLoginCard, { opacity: fadeAnim }]}>
              <Text style={styles.inputLabel}>Registered Phone or Email</Text>
              <TextInput
                style={styles.modernInput}
                placeholder="Enter saved phone number or email"
                placeholderTextColor="#8BA2A8"
                value={forgotRecoveryForm.identifier}
                onChangeText={(text) => setForgotRecoveryForm({ ...forgotRecoveryForm, identifier: text })}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => forgotNewPasswordInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                ref={forgotNewPasswordInputRef}
                style={styles.modernInput}
                placeholder="Enter new password"
                placeholderTextColor="#8BA2A8"
                value={forgotRecoveryForm.newPassword}
                onChangeText={(text) => setForgotRecoveryForm({ ...forgotRecoveryForm, newPassword: text })}
                secureTextEntry
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => forgotConfirmPasswordInputRef.current?.focus()}
              />

              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                ref={forgotConfirmPasswordInputRef}
                style={styles.modernInput}
                placeholder="Re-enter new password"
                placeholderTextColor="#8BA2A8"
                value={forgotRecoveryForm.confirmPassword}
                onChangeText={(text) => setForgotRecoveryForm({ ...forgotRecoveryForm, confirmPassword: text })}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={saveRecoveredPassword}
              />

              <Pressable style={styles.modernLoginButton} onPress={saveRecoveredPassword}>
                <Text style={styles.modernLoginButtonText}>Verify & Update Password</Text>
              </Pressable>
              <Pressable style={styles.forgotPasswordButton} onPress={() => setScreen("login")}>
                <Text style={styles.forgotPasswordText}>Back to Login</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.loginPoweredBadgeInline}>
              <Text style={styles.poweredBadgeSmall}>Powered by</Text>
              <Text style={styles.poweredBadgeName}>Crescent IT Solution</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <AppAlertHost />
      </SafeAreaView>
    );
  }

  if (isLoggedIn && isSessionLocked) {
    return (
      <SafeAreaView style={styles.darkSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E3B43" />
        <KeyboardAvoidingView
          style={styles.modernLoginScreen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View style={[styles.loginBlobOne, { opacity: 0.9 }]} />
          <Animated.View style={[styles.loginBlobTwo, { opacity: 0.9 }]} />

          <ScrollView
            style={styles.loginScroll}
            contentContainerStyle={styles.loginScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.loginHeroWrap, { opacity: fadeAnim }]}>
              <Text style={styles.loginTopMini}>Security Lock</Text>
              <Text style={styles.loginHeroTitle}>DailyTask Locked</Text>
              <Text style={styles.loginHeroSub}>
                Authenticate again to continue your work safely.
              </Text>
            </Animated.View>

            <Animated.View style={[styles.modernLoginCard, { opacity: fadeAnim }]}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.lockUserBox}>
                <Text style={styles.lockUserText}>{profileData.username || demoUser.username}</Text>
              </View>

              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                ref={lockPasswordInputRef}
                style={styles.modernInput}
                placeholder="Enter password"
                placeholderTextColor="#8BA2A8"
                value={unlockPassword}
                onChangeText={setUnlockPassword}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleUnlockPasswordSubmit}
              />

              <Pressable style={styles.modernLoginButton} onPress={unlockSessionWithPassword}>
                <Text style={styles.modernLoginButtonText}>Unlock App</Text>
              </Pressable>

              {biometricEnabled ? (
                <Pressable style={styles.biometricLoginButton} onPress={unlockSessionWithBiometric}>
                  <Text style={styles.biometricLoginIcon}>🔐</Text>
                  <Text style={styles.biometricLoginText}>Unlock with Biometric</Text>
                </Pressable>
              ) : null}

              <Pressable style={styles.forgotPasswordButton} onPress={closeAppWithConfirmation}>
                <Text style={styles.forgotPasswordText}>Close App</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.loginPoweredBadgeInline}>
              <Text style={styles.poweredBadgeSmall}>Powered by</Text>
              <Text style={styles.poweredBadgeName}>Crescent IT Solution</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <AppAlertHost />
      </SafeAreaView>
    );
  }


  if (isLoggedIn && screen === "setupProfile") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#EEF5F7" />
        <ScrollView
          style={styles.pageContent}
          contentContainerStyle={styles.pageScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
          <View style={styles.setupHeroCard}>
            <View style={styles.setupAvatarCircle}>
              <Text style={styles.setupAvatarText}>👤</Text>
            </View>
            <Text style={styles.setupTitle}>Set up your profile</Text>
            <Text style={styles.setupSubtitle}>
              This is local to this mobile. Your name will show on the dashboard and reports.
            </Text>
          </View>

          <View style={styles.editCard}>
            <Input
              label="Full Name"
              value={editProfile.fullName}
              onChangeText={(text) => setEditProfile({ ...editProfile, fullName: text })}
              placeholder="Example: Nousath / James / Rahim"
            />
            <Input
              label="Employee ID"
              value={editProfile.employeeId}
              onChangeText={(text) => setEditProfile({ ...editProfile, employeeId: text })}
              placeholder="Example: 10036"
            />
            <Input
              label="Phone"
              value={editProfile.phone}
              onChangeText={(text) => setEditProfile({ ...editProfile, phone: text })}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
            />
            <Input
              label="Email"
              value={editProfile.email}
              onChangeText={(text) => setEditProfile({ ...editProfile, email: text })}
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Designation"
              value={editProfile.designation}
              onChangeText={(text) => setEditProfile({ ...editProfile, designation: text })}
              placeholder="Example: IT Support / CCTV Technician"
            />
            <Input
              label="Department"
              value={editProfile.department}
              onChangeText={(text) => setEditProfile({ ...editProfile, department: text })}
              placeholder="Example: IT"
            />
            <Pressable style={styles.primaryButton} onPress={saveInitialProfile}>
              <Text style={styles.primaryButtonText}>Save & Continue</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={continueAsAdminProfile}>
              <Text style={styles.secondaryButtonText}>Continue as Admin</Text>
            </Pressable>
          </View>

          <Text style={styles.setupFooterText}>You can edit this later from Profile.</Text>
          <View style={styles.bottomSpace} />
        </ScrollView>
        <AppAlertHost />
      </SafeAreaView>
    );
  }

  if (isLoggedIn && screen === "profile") {
    return (
      <Page title="Profile" subtitle="Your local account details" onBack={goBack} rightText="Edit" onRight={openEditProfile}>
        <View style={styles.profileMainCard}>
          <View style={styles.profilePhotoLargeWrap}>
            {currentUser?.profilePhotoUri ? (
              <Image source={{ uri: currentUser.profilePhotoUri }} style={styles.profilePhotoLarge} />
            ) : (
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.profileAvatarLargeText}>{getInitial()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{currentUser?.fullName}</Text>
          <Text style={styles.profileDesignation}>{currentUser?.designation || "No designation added"}</Text>
          <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>{currentUser?.role}</Text></View>

          <View style={styles.profilePhotoButtonRow}>
            <Pressable style={styles.photoActionButton} onPress={pickProfilePhoto}>
              <Text style={styles.photoActionButtonText}>{currentUser?.profilePhotoUri ? "Change Photo" : "Add Photo"}</Text>
            </Pressable>
            {currentUser?.profilePhotoUri ? (
              <Pressable style={styles.photoRemoveButton} onPress={removeProfilePhoto}>
                <Text style={styles.photoRemoveButtonText}>Remove</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Account Info</Text>
          <InfoRow label="Username" value={currentUser?.username || "--"} />
          <InfoRow label="Employee ID" value={currentUser?.employeeId || "--"} />
          <InfoRow label="Department" value={currentUser?.department || "--"} />
          <InfoRow label="Phone" value={currentUser?.phone || "--"} />
          <InfoRow label="Email" value={currentUser?.email || "--"} />
          <InfoRow label="Role" value={currentUser?.role || "--"} />
        </View>
        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Login Security</Text>
          <Text style={styles.helpText}>This password is saved locally on this mobile only.</Text>
          <Pressable style={styles.secondaryButton} onPress={() => setScreen("changePassword")}>
            <Text style={styles.secondaryButtonText}>Change Password</Text>
          </Pressable>
          <Pressable style={styles.lightWarningButton} onPress={resetPasswordToDefault}>
            <Text style={styles.lightWarningButtonText}>Reset to admin123</Text>
          </Pressable>
          <View style={styles.securityDivider} />
          <InfoLine label="Biometric Login" value={biometricEnabled ? "Enabled" : "Disabled"} />
          <Text style={styles.helpText}>Enable fingerprint, face unlock or phone lock login for this device.</Text>
          {biometricEnabled ? (
            <Pressable style={styles.lightWarningButton} onPress={disableBiometricLogin}>
              <Text style={styles.lightWarningButtonText}>Disable Biometric Login</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.secondaryButton} onPress={enableBiometricLogin}>
              <Text style={styles.secondaryButtonText}>Enable Biometric Login</Text>
            </Pressable>
          )}
        </View>
        <Pressable style={styles.dangerButton} onPress={handleLogout}><Text style={styles.dangerButtonText}>Logout</Text></Pressable>
      </Page>
    );
  }

  if (isLoggedIn && screen === "changePassword") {
    return (
      <Page title="Change Password" subtitle="Local login password" onBack={goBack}>
        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Login Details</Text>
          <InfoLine label="Username" value={profileData.username || demoUser.username} />
          <Input
            label="Current Password"
            value={changePasswordForm.currentPassword}
            onChangeText={(text) => setChangePasswordForm({ ...changePasswordForm, currentPassword: text })}
            placeholder="Enter current password"
            secureTextEntry
          />
          <Input
            label="New Password"
            value={changePasswordForm.newPassword}
            onChangeText={(text) => setChangePasswordForm({ ...changePasswordForm, newPassword: text })}
            placeholder="Enter new password"
            secureTextEntry
          />
          <Input
            label="Confirm New Password"
            value={changePasswordForm.confirmPassword}
            onChangeText={(text) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: text })}
            placeholder="Re-enter new password"
            secureTextEntry
          />
          <Pressable style={styles.primaryButton} onPress={saveLocalPassword}>
            <Text style={styles.primaryButtonText}>Save Password</Text>
          </Pressable>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Forgot Password</Text>
          <Text style={styles.helpText}>Use this only on your own phone. It resets only the local password and keeps all app data.</Text>
          <Pressable style={styles.lightWarningButton} onPress={resetPasswordToDefault}>
            <Text style={styles.lightWarningButtonText}>Reset Password to admin123</Text>
          </Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "editProfile") {
    return (
      <Page title="Edit Profile" subtitle="Update your details" onBack={goBack}>
        <View style={styles.editCard}>
          <Input label="Full Name" value={editProfile.fullName} onChangeText={(text) => setEditProfile({ ...editProfile, fullName: text })} placeholder="Enter full name" />
          <Input label="Employee ID" value={editProfile.employeeId} onChangeText={(text) => setEditProfile({ ...editProfile, employeeId: text })} placeholder="Example: 10036" />
          <Input label="Phone" value={editProfile.phone} onChangeText={(text) => setEditProfile({ ...editProfile, phone: text })} placeholder="Enter mobile number" keyboardType="phone-pad" />
          <Input label="Email" value={editProfile.email} onChangeText={(text) => setEditProfile({ ...editProfile, email: text })} placeholder="Enter email" autoCapitalize="none" keyboardType="email-address" />
          <Input label="Designation" value={editProfile.designation} onChangeText={(text) => setEditProfile({ ...editProfile, designation: text })} placeholder="Example: IT Support / CCTV Technician" />
          <Input label="Department" value={editProfile.department} onChangeText={(text) => setEditProfile({ ...editProfile, department: text })} placeholder="Example: IT" />
          <Pressable style={styles.primaryButton} onPress={saveProfile}><Text style={styles.primaryButtonText}>Save Profile</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "attendance") {
    return (
      <Page title="Attendance" subtitle={getTodayDisplay()} onBack={goBack} rightText="Edit" onRight={openEditAttendance}>
        <View style={styles.attendanceCard}>
          <Text style={styles.cardTitle}>Today Status</Text>
          <Text style={styles.cardSubtitle}>{todayAttendance.dayType} • {todayAttendance.status}</Text>
          <View style={styles.timeRow}>
            <TimeBox label="Clock In" value={todayAttendance.checkIn ? formatDisplayTime(todayAttendance.checkIn) : "--"} />
            <TimeBox label="Clock Out" value={todayAttendance.checkOut ? formatDisplayTime(todayAttendance.checkOut) : "--"} />
          </View>
          <View style={styles.clockButtonRow}>
            <Pressable style={styles.clockInButton} onPress={handleClockIn}><Text style={styles.clockInText}>Clock In</Text></Pressable>
            <Pressable style={styles.clockOutButton} onPress={handleClockOut}><Text style={styles.clockOutText}>Clock Out</Text></Pressable>
          </View>
          <Text style={styles.totalWorkedText}>Total Worked: {workedTimeText} • Extra Earned: {extraTimeText}</Text>
        </View>

        <View style={styles.editCard}>
          <View style={styles.dutySummaryHeader}>
            <View>
              <Text style={styles.sectionMiniTitle}>Duty Summary</Text>
              <Text style={styles.dutySummarySub}>Tap settings only when you need to adjust duty values.</Text>
            </View>
            <Pressable
              style={[styles.dutySettingsButton, showDutySettings && styles.dutySettingsButtonActive]}
              onPress={() => setShowDutySettings(!showDutySettings)}
            >
              <Text style={[styles.dutySettingsIcon, showDutySettings && styles.dutySettingsIconActive]}>⚙</Text>
            </Pressable>
          </View>
          <View style={styles.summaryGrid}>
            <SummaryCard title="Worked" value={workedTimeText} subtitle="Today" />
            <SummaryCard title="Extra" value={extraTimeText} subtitle="Earned" />
            <SummaryCard title="Normal Duty" value={`${todayAttendance.normalDutyHours || "0"}h`} subtitle="Daily" />
            <SummaryCard title="Extra Used" value={todayAttendance.extraHoursUsed || "0"} subtitle="Hours" />
          </View>
          {showDutySettings ? (
            <View style={styles.dutySettingsPanel}>
              <Input label="Normal Duty Hours" value={todayAttendance.normalDutyHours} onChangeText={(text) => setTodayAttendance({ ...todayAttendance, normalDutyHours: cleanDecimal(text) })} placeholder="Example: 9" keyboardType="decimal-pad" />
              <Input label="Extra Hours Used Today" value={todayAttendance.extraHoursUsed} onChangeText={(text) => setTodayAttendance({ ...todayAttendance, extraHoursUsed: cleanDecimal(text) })} placeholder="Example: 1.5" keyboardType="decimal-pad" />
            </View>
          ) : null}
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Day Type</Text>
          <Text style={styles.helpText}>Select the main type first. Leave and public holiday options will appear only when required.</Text>

          <View style={styles.attendanceTypeGrid}>
            {ATTENDANCE_MAIN_TYPES.map((mainType) => {
              const activeMainType = getAttendanceMainType(todayAttendance.dayType) === mainType;
              return (
                <Pressable
                  key={mainType}
                  style={[styles.attendanceTypeButton, activeMainType && styles.attendanceTypeButtonActive]}
                  onPress={() => {
                    if (mainType === "Work Day") return setAttendanceDayType("Work Day");
                    if (mainType === "Day Off / Leave") return setAttendanceDayType("Normal Day Off");
                    if (mainType === "Public Holiday") return setAttendanceDayType("PH Off");
                    return setAttendanceDayType("Off Cancelled");
                  }}
                >
                  <Text style={[styles.attendanceTypeButtonText, activeMainType && styles.attendanceTypeButtonTextActive]}>{mainType}</Text>
                </Pressable>
              );
            })}
          </View>

          {getAttendanceMainType(todayAttendance.dayType) === "Day Off / Leave" ? (
            <View style={styles.attendanceSubPanel}>
              <DropdownSelect
                label="Leave / Off Type"
                value={ATTENDANCE_LEAVE_TYPES.includes(todayAttendance.dayType) ? todayAttendance.dayType : "Normal Day Off"}
                placeholder="Select leave/off type"
                options={ATTENDANCE_LEAVE_TYPES}
                onSelect={setAttendanceDayType}
              />
            </View>
          ) : null}

          {getAttendanceMainType(todayAttendance.dayType) === "Public Holiday" ? (
            <View style={styles.attendanceSubPanel}>
              <DropdownSelect
                label="Public Holiday Type"
                value={ATTENDANCE_PH_TYPES.includes(todayAttendance.dayType) ? todayAttendance.dayType : "PH Off"}
                placeholder="Select PH type"
                options={ATTENDANCE_PH_TYPES}
                onSelect={setAttendanceDayType}
              />
            </View>
          ) : null}

          <View style={styles.selectedDayTypeBox}>
            <Text style={styles.selectedDayTypeLabel}>Selected Day Type</Text>
            <Text style={styles.selectedDayTypeValue}>{todayAttendance.dayType}</Text>
          </View>

          <Input label="Reason / Notes" value={todayAttendance.note} onChangeText={(text) => setTodayAttendance({ ...todayAttendance, note: text })} placeholder="Example: Annual leave, vacation, PH work, pending off reason" multiline />
          <Pressable style={styles.secondaryButton} onPress={saveAttendanceDetails}><Text style={styles.secondaryButtonText}>Save Attendance Details</Text></Pressable>
        </View>

        <View style={styles.editCard}>
          <MonthNav title={getMonthTitle(attendanceMonth.year, attendanceMonth.monthIndex)} onPrev={() => moveAttendanceMonth(-1)} onNext={() => moveAttendanceMonth(1)} />
          <Pressable style={[styles.primaryButton, styles.attendanceExportButton]} onPress={exportAttendanceTimesheetExcel}>
            <Text style={styles.primaryButtonText}>Export Timesheet Excel</Text>
          </Pressable>
          <View style={styles.summaryGrid}>
            <SummaryCard title="Records" value={String(monthSummary.totalRecords)} subtitle="Month" />
            <SummaryCard title="Worked" value={String(monthSummary.workedDays)} subtitle="Days" />
            <SummaryCard title="Off Days" value={String(monthSummary.offDays)} subtitle="Month" />
            <SummaryCard title="Extra" value={minutesToReadable(monthSummary.extraMinutes)} subtitle="Earned" />
          </View>
          <Text style={styles.sectionMiniTitle}>Carry Forward Balance</Text>
          <View style={styles.summaryGrid}>
            <SummaryCard title="Pending Off" value={String(carryForwardBalance.pendingClosing)} subtitle="Closing" />
            <SummaryCard title="PH Balance" value={String(carryForwardBalance.phClosing)} subtitle="Closing" />
            <SummaryCard title="Extra Hours" value={minutesToReadable(carryForwardBalance.extraClosingMinutes)} subtitle="Closing" />
            <SummaryCard title="PH Off" value={String(carryForwardBalance.phOffCount)} subtitle="This month" />
          </View>
          <View style={styles.historyTitleRow}>
            <Text style={styles.sectionMiniTitle}>Recent Attendance History</Text>
            <Text style={styles.historyCountText}>{Math.min(monthRecords.length, 3)} / {monthRecords.length}</Text>
          </View>
          {monthRecords.length === 0 ? (
            <EmptyBox title="No attendance history" text="Attendance history for this month will show here." />
          ) : null}
          {monthRecords.slice(0, 3).map((record) => (
            <View key={record.date} style={styles.historyRow}>
              <Text style={styles.historyTitle}>{formatDateForDisplay(record.date)} • {record.dayType}</Text>
              <Text style={styles.historyText}>In: {record.checkIn || "--"} • Out: {record.checkOut || "--"} • {record.status}</Text>
              {record.note ? <Text style={styles.historyNote}>{record.note}</Text> : null}
            </View>
          ))}
          {monthRecords.length > 0 ? (
            <Pressable style={styles.viewAllHistoryButton} onPress={() => setScreen("attendanceHistory")}>
              <Text style={styles.viewAllHistoryButtonText}>View All Attendance Days</Text>
            </Pressable>
          ) : null}
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "attendanceHistory") {
    const attendanceFilterOptions = ["All", ...ATTENDANCE_DAY_TYPES];
    const filteredAttendanceHistory = attendanceHistoryFilter === "All"
      ? monthRecords
      : monthRecords.filter((record) => record.dayType === attendanceHistoryFilter);

    return (
      <Page title="Attendance History" subtitle="View and filter all days" onBack={goBack}>
        <View style={styles.editCard}>
          <MonthNav
            title={getMonthTitle(attendanceMonth.year, attendanceMonth.monthIndex)}
            onPrev={() => moveAttendanceMonth(-1)}
            onNext={() => moveAttendanceMonth(1)}
          />
          <Text style={styles.inputLabel}>Filter by Day Type</Text>
          <View style={styles.optionRow}>
            {attendanceFilterOptions.map((type) => (
              <OptionButton
                key={type}
                title={type}
                active={attendanceHistoryFilter === type}
                onPress={() => setAttendanceHistoryFilter(type)}
              />
            ))}
          </View>
          <View style={styles.historyFilterSummary}>
            <InfoLine label="Showing Records" value={String(filteredAttendanceHistory.length)} />
            <InfoLine label="Selected Filter" value={attendanceHistoryFilter} />
          </View>
        </View>

        {filteredAttendanceHistory.length === 0 ? (
          <EmptyBox title="No matching attendance records" text="Change the month or filter to view more records." />
        ) : null}

        {filteredAttendanceHistory.map((record) => (
          <View key={record.date} style={styles.historyRowLarge}>
            <Text style={styles.historyTitle}>{formatDateForDisplay(record.date)} • {record.dayType}</Text>
            <Text style={styles.historyText}>Clock In: {record.checkIn ? formatDisplayTime(record.checkIn) : "--"}</Text>
            <Text style={styles.historyText}>Clock Out: {record.checkOut ? formatDisplayTime(record.checkOut) : "--"}</Text>
            <Text style={styles.historyText}>Status: {record.status || "--"}</Text>
            <Text style={styles.historyText}>Normal Duty: {record.normalDutyHours || "0"}h • Extra Used: {record.extraHoursUsed || "0"}</Text>
            {record.note ? <Text style={styles.historyNote}>Notes: {record.note}</Text> : null}
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "editAttendance") {
    return (
      <Page title="Edit Attendance" subtitle="Manual time correction" onBack={goBack}>
        <View style={styles.editCard}>
          <TimePickerField
            label="Clock In Time"
            value={editClockIn}
            onChange={setEditClockIn}
            placeholder="Select clock in time"
            allowClear
          />
          <TimePickerField
            label="Clock Out Time"
            value={editClockOut}
            onChange={setEditClockOut}
            placeholder="Select clock out time"
            allowClear
          />
          <Input label="Notes" value={editAttendanceNote} onChangeText={setEditAttendanceNote} placeholder="Reason or note" multiline />
          <Pressable style={styles.primaryButton} onPress={saveEditedAttendance}><Text style={styles.primaryButtonText}>Save Attendance</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "tasks") {
    return (
      <Page title="My Tasks" subtitle={`${pendingTaskCount} active, ${completedTaskCount} completed`} onBack={goBack}>
        <View style={styles.taskAddHeroCard}>
          <View style={styles.taskAddHeroIcon}>
            <Text style={styles.taskAddHeroIconText}>+</Text>
          </View>
          <View style={styles.taskAddHeroTextBox}>
            <Text style={styles.taskAddHeroTitle}>Create a new task</Text>
            <Text style={styles.taskAddHeroSub}>Add follow-up, branch work, personal reminders or pending jobs.</Text>
          </View>
          <Pressable style={styles.creativeAddTaskButton} onPress={openAddTask}>
            <Text style={styles.creativeAddTaskButtonText}>Add Task</Text>
          </Pressable>
        </View>

        <View style={styles.taskPageTopActions}>
          <Pressable style={styles.completedTaskButton} onPress={() => setScreen("completedTasks")}>
            <Text style={styles.completedTaskButtonText}>Completed Tasks ({completedTaskCount})</Text>
          </Pressable>
        </View>

        {activeTasks.length === 0 ? <EmptyBox title="No active tasks" text="Pending and in-progress tasks will show here. Completed tasks are moved to the Completed Tasks page." /> : null}
        {activeTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.category} • {task.priority} • {task.status}</Text>
              </View>
              <Pressable style={styles.taskEditIconButton} onPress={() => openEditTask(task)}>
                <Text style={styles.taskEditIconText}>✎</Text>
              </Pressable>
            </View>
            {task.dueDate ? <Text style={styles.taskInfo}>Due: {formatDateForDisplay(task.dueDate)}</Text> : null}
            {task.followUpDate ? <Text style={styles.taskInfo}>Follow Up: {formatDateForDisplay(task.followUpDate)}</Text> : null}
            {task.notes ? <Text style={styles.taskNotes}>{task.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => changeTaskStatus(task.id)}><Text style={styles.editMiniButtonText}>Change Status</Text></Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteTask(task.id)}><Text style={styles.deleteMiniButtonText}>Delete</Text></Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "completedTasks") {
    return (
      <Page title="Completed Tasks" subtitle={`${completedTaskCount} completed tasks`} onBack={goBack}>
        {completedTasks.length === 0 ? <EmptyBox title="No completed tasks" text="Tasks marked as completed will move here automatically." /> : null}
        {completedTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.category} • {task.priority} • Completed</Text>
              </View>
              <Pressable style={styles.taskEditIconButton} onPress={() => openEditTask(task)}>
                <Text style={styles.taskEditIconText}>✎</Text>
              </Pressable>
            </View>
            {task.dueDate ? <Text style={styles.taskInfo}>Due: {formatDateForDisplay(task.dueDate)}</Text> : null}
            {task.followUpDate ? <Text style={styles.taskInfo}>Follow Up: {formatDateForDisplay(task.followUpDate)}</Text> : null}
            {task.notes ? <Text style={styles.taskNotes}>{task.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => changeTaskStatus(task.id)}><Text style={styles.editMiniButtonText}>Move to Pending</Text></Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteTask(task.id)}><Text style={styles.deleteMiniButtonText}>Delete</Text></Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "addTask") {
    return (
      <Page title={editingTaskId ? "Edit Task" : "Add Task"} subtitle={editingTaskId ? "Update task details" : "Create a new task"} onBack={goBack}>
        <View style={styles.editCard}>
          <Input label="Task Title" value={newTask.title} onChangeText={(text) => setNewTask({ ...newTask, title: text })} placeholder="Example: Follow up CCTV issue" />
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.optionRow}>
            {["Company", "Personal"].map((item) => <OptionButton key={item} title={item} active={newTask.category === item} onPress={() => setNewTask({ ...newTask, category: item })} />)}
          </View>
          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.optionRow}>
            {["Low", "Medium", "High"].map((item) => <OptionButton key={item} title={item} active={newTask.priority === item} onPress={() => setNewTask({ ...newTask, priority: item })} />)}
          </View>
          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.optionRow}>
            {["Pending", "In Progress", "Completed"].map((item) => <OptionButton key={item} title={item} active={newTask.status === item} onPress={() => setNewTask({ ...newTask, status: item })} />)}
          </View>
          <DatePickerField
            label="Due Date"
            value={newTask.dueDate}
            onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
            placeholder="Select due date"
            allowClear
          />
          <DatePickerField
            label="Follow Up Date"
            value={newTask.followUpDate}
            onChange={(date) => setNewTask({ ...newTask, followUpDate: date })}
            placeholder="Select follow-up date"
            allowClear
          />
          <Input label="Notes" value={newTask.notes} onChangeText={(text) => setNewTask({ ...newTask, notes: text })} placeholder="Notes" multiline />
          <Pressable style={styles.primaryButton} onPress={addTask}><Text style={styles.primaryButtonText}>{editingTaskId ? "Update Task" : "Save Task"}</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "pettyCash") {
    return (
      <Page title="Petty Cash" subtitle="Current open period, expenses and transfers" onBack={goBack} rightText="Report" onRight={() => setScreen("pettyReport")}>
        <View style={styles.moneyCard}>
          <Text style={styles.moneyCardLabel}>Current Open Period Cash With Me</Text>
          <Text style={styles.moneyCardValue}>{formatAED(pettyTotals.cashWithMe)}</Text>
          <Text style={styles.moneyCardSub}>{pettyOpenPeriod.periodText}</Text>
          <Text style={styles.moneyCardSub}>Book Balance {formatAED(pettyTotals.bookBalance)} • In Transfer {formatAED(pettyTotals.cashInTransfer)}</Text>
          {pettyOpenPeriod.latestClosing ? (
            <Text style={styles.moneyCardSub}>Last Closed: {formatDateForDisplay(pettyOpenPeriod.latestClosing.date)} • {formatAED(pettyOpenPeriod.latestClosing.amount)}</Text>
          ) : null}
        </View>
        <View style={styles.summaryGrid}>
          <SummaryCard title="Received" value={formatAED(pettyTotals.totalReceived)} subtitle="Open period" />
          <SummaryCard title="Expenses" value={formatAED(pettyTotals.totalSpent)} subtitle="Open period" />
          <SummaryCard title="Transfer Out" value={formatAED(pettyTotals.transferOut)} subtitle="Open period" />
          <SummaryCard title="Transfer In" value={formatAED(pettyTotals.transferIn)} subtitle="Open period" />
        </View>
        <View style={styles.actionColumn}>
          <Pressable style={styles.actionButton} onPress={openAddCashReceived}><Text style={styles.actionButtonText}>+ Add Received Cash</Text></Pressable>
          <Pressable style={styles.actionButtonDark} onPress={openAddPettyExpense}><Text style={styles.actionButtonDarkText}>+ Add Expense</Text></Pressable>
          <Pressable style={styles.actionButtonOrange} onPress={openAddCashTransfer}><Text style={styles.actionButtonOrangeText}>+ Add Cash Transfer</Text></Pressable>
          <Pressable style={styles.secondaryButton} onPress={openPettyMonthClosing}><Text style={styles.secondaryButtonText}>✓ Month Closing</Text></Pressable>
        </View>

        <View style={styles.pettySearchBox}>
          <Text style={styles.pettySearchTitle}>Search Petty Cash</Text>
          <TextInput
            style={styles.pettySearchInput}
            placeholder="Search supplier, invoice, branch, item, person..."
            placeholderTextColor="#8BA2A8"
            value={pettyCashSearch}
            onChangeText={setPettyCashSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {pettyCashSearchActive ? (
            <View style={styles.rowBetween}>
              <Text style={styles.pettySearchMeta}>{pettyCashSearchResultCount} matching records found</Text>
              <Pressable style={styles.pettySearchClearButton} onPress={() => setPettyCashSearch("")}>
                <Text style={styles.pettySearchClearText}>Clear</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.pettySearchMeta}>Search expenses, transfers and received cash records.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Latest Expenses</Text>
        {pettyCashExpenses.length === 0 ? <EmptyBox title="No expenses yet" text="Add supplier invoice expenses." /> : null}
        {pettyCashExpenses.length > 0 && filteredPettyCashExpenses.length === 0 ? <EmptyBox title="No matching expenses" text="No expense matches your search." /> : null}
        {filteredPettyCashExpenses.slice(0, 20).map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}><Text style={styles.expenseSupplier}>{expense.supplier}</Text><Text style={styles.expenseDescription}>{expense.itemDescription}</Text></View>
              <Text style={styles.expenseAmount}>{formatAED(expense.totalAmount)}</Text>
            </View>
            <Text style={styles.expenseMeta}>{formatDateForDisplay(expense.date)} • {expense.company} • {expense.branch}</Text>
            {expense.bcBranchCode ? <Text style={styles.expenseMeta}>BC Branch: {expense.bcBranchCode}</Text> : null}
            <Text style={styles.expenseMeta}>Ex.VAT {formatAED(expense.amountExVat)} • VAT {formatAED(expense.vatAmount)} • {expense.vatType}</Text>
            {expense.paidBy ? <Text style={styles.expenseMeta}>Paid / Handled By: {expense.paidBy}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => openEditPettyExpense(expense)}><Text style={styles.editMiniButtonText}>Edit</Text></Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deletePettyExpense(expense.id)}><Text style={styles.deleteMiniButtonText}>Delete</Text></Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Cash Transfers</Text>
        {cashTransfers.length === 0 ? <EmptyBox title="No transfers yet" text="Use transfer when petty cash is handed over or returned." /> : null}
        {cashTransfers.length > 0 && filteredCashTransfers.length === 0 ? <EmptyBox title="No matching transfers" text="No cash transfer matches your search." /> : null}
        {filteredCashTransfers.slice(0, 20).map((transfer) => (
          <View key={transfer.id} style={styles.transferCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}><Text style={styles.expenseSupplier}>{transfer.transferType}</Text><Text style={styles.expenseDescription}>{transfer.personName}</Text></View>
              <Text style={[styles.expenseAmount, transfer.transferType === "Transfer Out" ? styles.amountDanger : styles.amountSuccess]}>{transfer.transferType === "Transfer Out" ? "-" : "+"}{formatAED(transfer.amount)}</Text>
            </View>
            <Text style={styles.expenseMeta}>{formatDateForDisplay(transfer.date)} • {transfer.purpose || "No purpose"}</Text>
            {transfer.closingId ? <Text style={styles.expenseMeta}>Created by Month Closing</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => openEditCashTransfer(transfer)}><Text style={styles.editMiniButtonText}>Edit</Text></Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteCashTransfer(transfer.id)}><Text style={styles.deleteMiniButtonText}>Delete</Text></Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Received Cash</Text>
        {cashReceivedRecords.length === 0 ? <EmptyBox title="No received cash record" text="Add the amount received from office." /> : null}
        {cashReceivedRecords.length > 0 && filteredCashReceivedRecords.length === 0 ? <EmptyBox title="No matching received cash" text="No received cash record matches your search." /> : null}
        {filteredCashReceivedRecords.slice(0, 10).map((record) => (
          <View key={record.id} style={styles.receivedCard}>
            <Text style={styles.receivedAmount}>{formatAED(record.amount)}</Text>
            <Text style={styles.receivedMeta}>{formatDateForDisplay(record.date)} • {record.receivedFrom}</Text>
            {record.notes ? <Text style={styles.receivedNote}>{record.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => openEditCashReceived(record)}><Text style={styles.editMiniButtonText}>Edit</Text></Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteCashReceived(record.id)}><Text style={styles.deleteMiniButtonText}>Delete</Text></Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "addCashReceived") {
    return (
      <Page title={editingCashReceivedId ? "Edit Received Cash" : "Add Received Cash"} subtitle="Cash received from office" onBack={goBack}>
        <View style={styles.editCard}>
          <DatePickerField
            label="Date Received"
            value={newCashReceived.date}
            onChange={(date) => setNewCashReceived({ ...newCashReceived, date })}
            placeholder="Select received date"
          />
          <Input label="Amount Received" value={newCashReceived.amount} onChangeText={(text) => setNewCashReceived({ ...newCashReceived, amount: cleanDecimal(text) })} placeholder="Example: 1500" keyboardType="decimal-pad" />
          <Input label="Received From" value={newCashReceived.receivedFrom} onChangeText={(text) => setNewCashReceived({ ...newCashReceived, receivedFrom: text })} placeholder="Example: Office" />
          <Input label="Notes" value={newCashReceived.notes} onChangeText={(text) => setNewCashReceived({ ...newCashReceived, notes: text })} placeholder="Notes" multiline />
          <Pressable style={styles.primaryButton} onPress={addCashReceived}><Text style={styles.primaryButtonText}>{editingCashReceivedId ? "Update Received Cash" : "Save Received Cash"}</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "pettyMonthClosing") {
    return (
      <Page title="Month Closing" subtitle="Settle current petty cash period" onBack={goBack}>
        <View style={styles.moneyCard}>
          <Text style={styles.moneyCardLabel}>Expected Settlement</Text>
          <Text style={styles.moneyCardValue}>{formatAED(pettyTotals.cashWithMe)}</Text>
          <Text style={styles.moneyCardSub}>{pettyOpenPeriod.periodText}</Text>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Close Current Period</Text>
          <DatePickerField
            label="Closing Date"
            value={newMonthClosing.date}
            onChange={(date) => setNewMonthClosing({ ...newMonthClosing, date })}
            placeholder="Select closing date"
          />
          <Input
            label="Settlement To"
            value={newMonthClosing.settlementTo}
            onChangeText={(text) => setNewMonthClosing({ ...newMonthClosing, settlementTo: text })}
            placeholder="Example: Office / Rahim"
          />
          <Input
            label="Settlement Amount"
            value={newMonthClosing.amount}
            onChangeText={(text) => setNewMonthClosing({ ...newMonthClosing, amount: cleanDecimal(text) })}
            placeholder="Amount should match Cash With Me"
            keyboardType="decimal-pad"
          />
          <Input
            label="Notes"
            value={newMonthClosing.notes}
            onChangeText={(text) => setNewMonthClosing({ ...newMonthClosing, notes: text })}
            placeholder="Example: June petty cash settlement"
            multiline
          />
          <View style={styles.calculationBox}>
            <Text style={styles.calculationTitle}>Closing Rule</Text>
            <InfoLine label="Cash With Me" value={formatAED(pettyTotals.cashWithMe)} />
            <InfoLine label="Settlement Amount" value={formatAED(newMonthClosing.amount)} />
            <Text style={styles.noteHelpText}>For Month Closing, settlement amount must equal Cash With Me. For partial handover, use Add Cash Transfer.</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={savePettyMonthClosing}>
            <Text style={styles.primaryButtonText}>Close Month</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Closing History</Text>
        {pettyClosingHistory.length === 0 ? (
          <EmptyBox title="No closing records" text="Close a month after petty cash settlement is completed." />
        ) : null}
        {pettyClosingHistory.slice(0, 20).map((closing) => (
          <View key={closing.id} style={styles.expenseCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseSupplier}>{formatDateForDisplay(closing.date)}</Text>
                <Text style={styles.expenseDescription}>Settled to {closing.settlementTo || "Office"}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatAED(closing.amount)}</Text>
            </View>
            {closing.notes ? <Text style={styles.expenseMeta}>Notes: {closing.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.deleteMiniButton} onPress={() => deletePettyMonthClosing(closing.id)}>
                <Text style={styles.deleteMiniButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "addCashTransfer") {
    return (
      <Page title={editingTransferId ? "Edit Cash Transfer" : "Cash Transfer"} subtitle="Transfer out or returned cash" onBack={goBack}>
        <View style={styles.editCard}>
          <DatePickerField
            label="Date"
            value={newTransfer.date}
            onChange={(date) => setNewTransfer({ ...newTransfer, date })}
            placeholder="Select transfer date"
          />
          <Text style={styles.inputLabel}>Transfer Type</Text>
          <View style={styles.optionRow}>
            {["Transfer Out", "Transfer In"].map((item) => <OptionButton key={item} title={item} active={newTransfer.transferType === item} onPress={() => setNewTransfer({ ...newTransfer, transferType: item })} />)}
          </View>
          <Input label="Person Name" value={newTransfer.personName} onChangeText={(text) => setNewTransfer({ ...newTransfer, personName: text })} placeholder="Example: James" />
          <Input label="Amount" value={newTransfer.amount} onChangeText={(text) => setNewTransfer({ ...newTransfer, amount: cleanDecimal(text) })} placeholder="Example: 200" keyboardType="decimal-pad" />
          <Input label="Purpose" value={newTransfer.purpose} onChangeText={(text) => setNewTransfer({ ...newTransfer, purpose: text })} placeholder="Example: CCTV materials" />
          <Input label="Notes" value={newTransfer.notes} onChangeText={(text) => setNewTransfer({ ...newTransfer, notes: text })} placeholder="Notes" multiline />
          <Pressable style={styles.primaryButton} onPress={addCashTransfer}><Text style={styles.primaryButtonText}>{editingTransferId ? "Update Cash Transfer" : "Save Cash Transfer"}</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "addPettyExpense") {
    const branchesForCompany = companyBranchesData[newExpense.company] || [];
    return (
      <Page title={editingExpenseId ? "Edit Expense" : "Add Expense"} subtitle="Supplier invoice entry" onBack={goBack}>
        <View style={styles.editCard}>
          <DatePickerField
            label="Date"
            value={newExpense.date}
            onChange={(date) => setNewExpense({ ...newExpense, date })}
            placeholder="Select expense date"
          />
          <DropdownSelect
            label="Supplier Name"
            value={newExpense.supplier}
            placeholder="Select supplier from master list"
            options={supplierList}
            onSelect={selectExpenseSupplier}
            emptyText="No suppliers in master data. You can type manually below."
          />
          <Input
            label="Supplier Manual Entry"
            value={newExpense.supplier}
            onChangeText={(text) => setNewExpense({ ...newExpense, supplier: text })}
            placeholder="Type supplier manually if not in list"
          />
          <SearchableBcBranchSelect
            label="BC Branch / Entity Code"
            value={newExpense.bcBranchCode}
            options={bcBranchList}
            preferredCodes={getBcBranchOptionsForCompany(newExpense.company)}
            onSelect={applyBcBranchToExpense}
            placeholder="Search by code or branch name"
            emptyText="No BC branch codes found. Use Load Built-in Master from Master Data."
          />
          {newExpense.bcBranchCode ? (
            <Text style={styles.noteHelpText}>
              Selected: {getBcBranchDisplayText(newExpense.bcBranchCode)}. Company and Branch are auto-filled below, but you can still edit manually.
            </Text>
          ) : (
            <Text style={styles.noteHelpText}>
              Optional. If not selected, use Company and Branch manual entry. BC export will fall back to normal Branch field.
            </Text>
          )}
          <DropdownSelect
            label="Spend For: Company"
            value={newExpense.company}
            placeholder="Select company"
            options={companyList}
            onSelect={selectExpenseCompany}
            emptyText="No companies in master data. You can type manually below."
          />
          <Input
            label="Company Manual Entry"
            value={newExpense.company}
            onChangeText={(text) => setNewExpense({ ...newExpense, company: text.toUpperCase() })}
            placeholder="Type company/entity manually if not in list"
            autoCapitalize="characters"
          />
          <DropdownSelect
            label="Spend For: Branch"
            value={newExpense.branch}
            placeholder={newExpense.company ? "Select branch" : "Select company first"}
            options={newExpense.company ? branchesForCompany : []}
            onSelect={(branch) => setNewExpense({ ...newExpense, branch })}
            emptyText={newExpense.company ? "No branches for this company. You can type manually below." : "Select company first."}
          />
          <Input
            label="Branch Manual Entry"
            value={newExpense.branch}
            onChangeText={(text) => setNewExpense({ ...newExpense, branch: text })}
            placeholder="Type branch manually if not in list"
            autoCapitalize="characters"
          />
          <Input label="Item Description" value={newExpense.itemDescription} onChangeText={(text) => setNewExpense({ ...newExpense, itemDescription: text })} placeholder="Example: Spray Paint" />
          <Input label="Invoice Amount" value={newExpense.invoiceAmount} onChangeText={(text) => setNewExpense({ ...newExpense, invoiceAmount: cleanDecimal(text) })} placeholder="Example: 15" keyboardType="decimal-pad" />
          <Text style={styles.inputLabel}>VAT Type</Text>
          <View style={styles.optionRow}>{["VAT Included", "No VAT", "Manual VAT"].map((item) => <OptionButton key={item} title={item} active={newExpense.vatType === item} onPress={() => setNewExpense({ ...newExpense, vatType: item })} />)}</View>
          {newExpense.vatType === "Manual VAT" ? (
            <>
              <Input label="Manual Amount Ex.VAT" value={newExpense.manualExVat} onChangeText={(text) => setNewExpense({ ...newExpense, manualExVat: cleanDecimal(text) })} placeholder="Example: 14.29" keyboardType="decimal-pad" />
              <Input label="Manual VAT Amount" value={newExpense.manualVat} onChangeText={(text) => setNewExpense({ ...newExpense, manualVat: cleanDecimal(text) })} placeholder="Example: 0.71" keyboardType="decimal-pad" />
            </>
          ) : null}
          <View style={styles.calculationBox}>
            <Text style={styles.calculationTitle}>Auto Calculation</Text>
            <InfoLine label="Invoice Amount" value={formatAED(currentExpenseCalc.invoiceAmount)} />
            <InfoLine label="Amount Ex.VAT" value={formatAED(currentExpenseCalc.amountExVat)} />
            <InfoLine label="VAT 5%" value={formatAED(currentExpenseCalc.vatAmount)} />
            <InfoLine label="Final Amount" value={formatAED(currentExpenseCalc.totalAmount)} />
          </View>
          <Input label="Invoice Number" value={newExpense.invoiceNumber} onChangeText={(text) => setNewExpense({ ...newExpense, invoiceNumber: text })} placeholder="Optional" />
          <Input label="Paid / Handled By" value={newExpense.paidBy} onChangeText={(text) => setNewExpense({ ...newExpense, paidBy: text })} placeholder="Example: Nousath / James" />
          <Input label="Notes" value={newExpense.notes} onChangeText={(text) => setNewExpense({ ...newExpense, notes: text })} placeholder="Notes" multiline />
          <Pressable style={styles.primaryButton} onPress={addPettyExpense}><Text style={styles.primaryButtonText}>{editingExpenseId ? "Update Expense" : "Save Expense"}</Text></Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "pettyReport") {
    return (
      <Page title="Petty Cash Report" subtitle="Mobile report preview" onBack={goBack}>
        <View style={styles.editCard}>
          <MonthNav title={getMonthTitle(pettyReportMonth.year, pettyReportMonth.monthIndex)} onPrev={() => movePettyReportMonth(-1)} onNext={() => movePettyReportMonth(1)} />
          <View style={styles.dateRangeBox}>
            <Text style={styles.sectionMiniTitle}>Export Date Range</Text>
            <DatePickerField label="From Date" value={pettyReportFromDate} onChange={setPettyReportFromDate} placeholder="Select from date" />
            <DatePickerField label="To Date" value={pettyReportToDate} onChange={setPettyReportToDate} placeholder="Select to date" />
            <Text style={styles.dateRangeHint}>Export and preview will use this selected period.</Text>
          </View>
          <View style={styles.reportSummaryBox}>
            <InfoLine label="Opening Book Balance" value={formatAED(pettyReport.openingBookBalance)} />
            <InfoLine label="Amount Received" value={formatAED(pettyReport.monthReceived)} />
            <InfoLine label="Total Expenses" value={formatAED(pettyReport.monthSpent)} />
            <InfoLine label="Transfer Out" value={formatAED(pettyReport.monthTransferOut)} />
            <InfoLine label="Transfer In" value={formatAED(pettyReport.monthTransferIn)} />
            <InfoLine label="Closing Book Balance" value={formatAED(pettyReport.closingBookBalance)} />
            <InfoLine label="Cash In Transfer" value={formatAED(pettyReport.closingCashInTransfer)} />
            <InfoLine label="Cash With Me" value={formatAED(pettyReport.closingCashWithMe)} />
          </View>
          <Pressable style={styles.primaryButton} onPress={exportPettyCashExcel}><Text style={styles.primaryButtonText}>Export Excel</Text></Pressable>
          <Pressable style={styles.secondaryButton} onPress={exportPettyCashBcExcel}><Text style={styles.secondaryButtonText}>Export BC Excel</Text></Pressable>
        </View>

        <Text style={styles.sectionTitle}>Report Expenses</Text>
        {pettyReport.expenses.length === 0 ? <EmptyBox title="No expenses in selected period" text="Select another date range or add expense records." /> : null}
        {pettyReport.expenses.map((expense) => (
          <View key={expense.id} style={styles.reportRowCard}>
            <Text style={styles.reportDate}>{formatDateForDisplay(expense.date)}</Text>
            <Text style={styles.reportMainText}>{expense.supplier}</Text>
            <Text style={styles.reportSubText}>Company: {expense.company || "--"}</Text>
            <Text style={styles.reportSubText}>Branch: {expense.branch || "--"}</Text>
            <Text style={styles.reportSubText}>Item: {expense.itemDescription || "--"}</Text>
            <Text style={styles.reportSubText}>Paid By: {expense.paidBy || "--"}</Text>
            <View style={styles.reportAmountGrid}>
              <InfoLine label="Invoice" value={formatAED(expense.invoiceAmount)} />
              <InfoLine label="Ex.VAT" value={formatAED(expense.amountExVat)} />
              <InfoLine label="VAT 5%" value={formatAED(expense.vatAmount)} />
              <InfoLine label="Amount" value={formatAED(expense.totalAmount)} />
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Report Transfers</Text>
        {pettyReport.transfers.length === 0 ? <EmptyBox title="No transfers in selected period" text="Transfer records will show here when available." /> : null}
        {pettyReport.transfers.map((transfer) => (
          <View key={transfer.id} style={styles.reportRowCard}>
            <Text style={styles.reportDate}>{formatDateForDisplay(transfer.date)}</Text>
            <Text style={styles.reportMainText}>{transfer.transferType}</Text>
            <Text style={styles.reportSubText}>Person: {transfer.personName}</Text>
            <Text style={styles.reportSubText}>Purpose: {transfer.purpose || "--"}</Text>
            <InfoLine label="Amount" value={formatAED(transfer.amount)} />
          </View>
        ))}
      </Page>
    );
  }


  if (isLoggedIn && screen === "reimbursement") {
    const latestRecords = [...reimbursementRecords]
      .filter((record) => reimbursementFilterMatches(record, reimbursementFilter))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return (
      <Page
        title="Reimbursement"
        subtitle="Parking, Salik, transportation, food and accommodation claim"
        onBack={goBack}
        rightText="Report"
        onRight={() => setScreen("reimbursementReport")}
      >
        <View style={styles.moneyCard}>
          <Text style={styles.moneyCardLabel}>Selected Period Claim</Text>
          <Text style={styles.moneyCardValue}>{formatAED(reimbursementReport.totalClaim)}</Text>
          <Text style={styles.moneyCardSub}>
            Transport {formatAED(reimbursementReport.totalTransportation)} • Food {formatAED(reimbursementReport.foodAccommodationTotal)} • Records {reimbursementReport.records.length}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryCard title="Pending" value={formatAED(reimbursementReport.pendingTotal)} subtitle="Not submitted" />
          <SummaryCard title="Submitted" value={formatAED(reimbursementReport.submittedTotal)} subtitle="Waiting" />
          <SummaryCard title="Reimbursed" value={formatAED(reimbursementReport.reimbursedTotal)} subtitle="Received" />
          <SummaryCard title="Food / Stay" value={formatAED(reimbursementReport.foodAccommodationTotal)} subtitle="Period" />
        </View>

        <View style={styles.actionColumn}>
          <Pressable style={styles.actionButtonDark} onPress={openAddReimbursement}>
            <Text style={styles.actionButtonDarkText}>+ Add Reimbursement</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={openReimbursementClaimSettlement}>
            <Text style={styles.secondaryButtonText}>Submit Claim / Settlement</Text>
          </Pressable>
        </View>

        <View style={styles.filterPanel}>
          <Text style={styles.inputLabel}>Filter Records</Text>
          <View style={styles.optionRow}>
            {["All", "Parking / Transport", "Food & Accommodation"].map((item) => (
              <OptionButton
                key={item}
                title={item}
                active={reimbursementFilter === item}
                onPress={() => setReimbursementFilter(item)}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Latest Records</Text>
        {latestRecords.length === 0 ? (
          <EmptyBox title="No reimbursement records" text="Add parking, Salik, transportation or food claim entries here." />
        ) : null}
        {latestRecords.slice(0, 30).map((record) => (
          <View key={record.id} style={styles.expenseCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseSupplier}>{record.expenseType}</Text>
                <Text style={styles.expenseDescription}>{record.purpose}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatAED(record.amount)}</Text>
            </View>
            <Text style={styles.expenseMeta}>{formatDateForDisplay(record.date)} • {record.company} • {record.branch}</Text>
            {record.bcBranchCode ? <Text style={styles.expenseMeta}>BC Branch: {record.bcBranchCode}</Text> : null}
            <Text style={styles.expenseMeta}>Status: {record.status} • Receipt: {record.receiptNo || "--"}</Text>
            {record.claimNo ? <Text style={styles.expenseMeta}>Claim: {record.claimNo}</Text> : null}
            {record.notes ? <Text style={styles.expenseMeta}>Notes: {record.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              <Pressable style={styles.editMiniButton} onPress={() => openEditReimbursement(record)}>
                <Text style={styles.editMiniButtonText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteReimbursementRecord(record.id)}>
                <Text style={styles.deleteMiniButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "reimbursementClaimSettlement") {
    return (
      <Page title="Claim Settlement" subtitle="Submit reimbursement claim batch" onBack={goBack}>
        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Claim Period</Text>
          <Text style={styles.dateRangeHint}>Default cycle: 24th to 23rd. You can change dates manually.</Text>
          <DatePickerField
            label="From Date"
            value={newReimbursementClaim.fromDate}
            onChange={(date) => setNewReimbursementClaim({ ...newReimbursementClaim, fromDate: date })}
            placeholder="Select from date"
          />
          <DatePickerField
            label="To Date"
            value={newReimbursementClaim.toDate}
            onChange={(date) => setNewReimbursementClaim({ ...newReimbursementClaim, toDate: date })}
            placeholder="Select to date"
          />
          <DatePickerField
            label="Submit Date"
            value={newReimbursementClaim.submitDate}
            onChange={(date) => setNewReimbursementClaim({ ...newReimbursementClaim, submitDate: date })}
            placeholder="Select submit date"
          />
          <Input
            label="Submitted To"
            value={newReimbursementClaim.submittedTo}
            onChangeText={(text) => setNewReimbursementClaim({ ...newReimbursementClaim, submittedTo: text })}
            placeholder="Example: Rahim / Office"
          />
          <Input
            label="Notes"
            value={newReimbursementClaim.notes}
            onChangeText={(text) => setNewReimbursementClaim({ ...newReimbursementClaim, notes: text })}
            placeholder="Example: Claim submitted for approval"
            multiline
          />
        </View>

        <View style={styles.reportSummaryBox}>
          <Text style={styles.sectionMiniTitle}>Full Period Summary</Text>
          <InfoLine label="Period" value={getDateRangeTitle(newReimbursementClaim.fromDate, newReimbursementClaim.toDate)} />
          <InfoLine label="All Records" value={String(reimbursementClaimReport.records.length)} />
          <InfoLine label="All Period Total" value={formatAED(reimbursementClaimReport.totalClaim)} />
          <InfoLine label="Parking / Salik" value={formatAED(reimbursementClaimReport.parkingSalikTotal)} />
          <InfoLine label="Other Transportation" value={formatAED(reimbursementClaimReport.otherTransportationTotal)} />
          <InfoLine label="Total Transportation" value={formatAED(reimbursementClaimReport.totalTransportation)} />
          <InfoLine label="Food & Accommodation" value={formatAED(reimbursementClaimReport.foodAccommodationTotal)} />
        </View>

        <View style={styles.reportSummaryBox}>
          <Text style={styles.sectionMiniTitle}>Pending Records to Submit</Text>
          <InfoLine label="Pending Records" value={String(reimbursementClaimEligibleReport.records.length)} />
          <InfoLine label="Pending Total Claim" value={formatAED(reimbursementClaimEligibleReport.totalClaim)} />
          <InfoLine label="Pending Transportation" value={formatAED(reimbursementClaimEligibleReport.totalTransportation)} />
          <InfoLine label="Pending Food / Accommodation" value={formatAED(reimbursementClaimEligibleReport.foodAccommodationTotal)} />
          <Pressable style={styles.primaryButton} onPress={submitReimbursementClaim}>
            <Text style={styles.primaryButtonText}>Submit Claim</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={exportReimbursementClaimExcel}>
            <Text style={styles.secondaryButtonText}>Export Claim Excel</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={exportReimbursementClaimBcExcel}>
            <Text style={styles.secondaryButtonText}>Export Claim BC Excel</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Pending Claim Records</Text>
        {reimbursementClaimEligibleReport.records.length === 0 ? (
          <EmptyBox title="No pending records" text="No pending records are available in this claim period." />
        ) : null}
        <ReimbursementReportSection title="Parking / Salik / Transportation Expenses" records={reimbursementClaimEligibleReport.transportRecords} />
        <ReimbursementReportSection title="Food & Accommodation Expenses" records={reimbursementClaimEligibleReport.foodRecords} />

        <Text style={styles.sectionTitle}>Claim History</Text>
        {reimbursementClaimHistory.length === 0 ? (
          <EmptyBox title="No claims submitted" text="Submitted reimbursement claim batches will show here." />
        ) : null}
        {reimbursementClaimHistory.slice(0, 20).map((claim) => (
          <View key={claim.id} style={styles.expenseCard}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseSupplier}>{claim.claimNo}</Text>
                <Text style={styles.expenseDescription}>{formatDateForDisplay(claim.fromDate)} to {formatDateForDisplay(claim.toDate)}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatAED(claim.totalAmount)}</Text>
            </View>
            <Text style={styles.expenseMeta}>Status: {claim.status} • Records: {claim.recordCount || 0}</Text>
            <Text style={styles.expenseMeta}>Submitted: {formatDateForDisplay(claim.submitDate)} • To: {claim.submittedTo || "--"}</Text>
            {claim.reimbursedDate ? <Text style={styles.expenseMeta}>Reimbursed Date: {formatDateForDisplay(claim.reimbursedDate)}</Text> : null}
            {claim.notes ? <Text style={styles.expenseMeta}>Notes: {claim.notes}</Text> : null}
            <View style={styles.cardActionRow}>
              {claim.status !== "Reimbursed" ? (
                <Pressable style={styles.editMiniButton} onPress={() => markReimbursementClaimReimbursed(claim.id)}>
                  <Text style={styles.editMiniButtonText}>Reimbursed</Text>
                </Pressable>
              ) : null}
              <Pressable style={styles.deleteMiniButton} onPress={() => deleteReimbursementClaim(claim.id)}>
                <Text style={styles.deleteMiniButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Page>
    );
  }

  if (isLoggedIn && screen === "addReimbursement") {
    const branchesForCompany = companyBranchesData[newReimbursement.company] || [];
    return (
      <Page
        title={editingReimbursementId ? "Edit Reimbursement" : "Add Reimbursement"}
        subtitle="Parking, Salik, transportation, food and accommodation entry"
        onBack={goBack}
      >
        <View style={styles.editCard}>
          <DatePickerField
            label="Date"
            value={newReimbursement.date}
            onChange={(date) => setNewReimbursement({ ...newReimbursement, date })}
            placeholder="Select expense date"
          />

          <SearchableBcBranchSelect
            label="BC Branch / Entity Code"
            value={newReimbursement.bcBranchCode}
            options={bcBranchList}
            preferredCodes={getBcBranchOptionsForCompany(newReimbursement.company)}
            onSelect={applyBcBranchToReimbursement}
            placeholder="Search by code or branch name"
            emptyText="No BC branch codes found. Use Load Built-in Master from Master Data."
          />
          {newReimbursement.bcBranchCode ? (
            <Text style={styles.noteHelpText}>
              Selected: {getBcBranchDisplayText(newReimbursement.bcBranchCode)}. Company and Branch are auto-filled below, but you can still edit manually.
            </Text>
          ) : (
            <Text style={styles.noteHelpText}>
              Optional. If not selected, use Company and Branch manual entry. BC export will fall back to normal Branch field.
            </Text>
          )}

          <Text style={styles.inputLabel}>Company</Text>
          <View style={styles.optionRow}>
            {companyList.map((company) => (
              <OptionButton
                key={company}
                title={company}
                active={newReimbursement.company === company}
                onPress={() => selectReimbursementCompany(company)}
              />
            ))}
          </View>

          <Input
            label="Company Manual Entry"
            value={newReimbursement.company}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, company: text.toUpperCase() })}
            placeholder="Type company/entity manually if not in list"
            autoCapitalize="characters"
          />

          <Text style={styles.inputLabel}>Branch</Text>
          {newReimbursement.company ? (
            <View style={styles.optionRow}>
              {branchesForCompany.map((branch) => (
                <OptionButton
                  key={branch}
                  title={branch}
                  active={newReimbursement.branch === branch}
                  onPress={() => setNewReimbursement({ ...newReimbursement, branch })}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noteHelpText}>Select company first or type manually.</Text>
          )}

          <Input
            label="Branch Manual Entry"
            value={newReimbursement.branch}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, branch: text })}
            placeholder="Type branch manually if not in list"
            autoCapitalize="characters"
          />

          <Text style={styles.inputLabel}>Expense Type</Text>
          <View style={styles.optionRow}>
            {["Parking", "Salik", "Other Transportation", "Food & Accommodation"].map((item) => (
              <OptionButton
                key={item}
                title={item}
                active={newReimbursement.expenseType === item}
                onPress={() => setNewReimbursement({ ...newReimbursement, expenseType: item })}
              />
            ))}
          </View>

          <Input
            label="Description / Purpose / Reason of Expense"
            value={newReimbursement.purpose}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, purpose: text })}
            placeholder="Example: CCTV offline checking visit"
            multiline
          />
          <Input
            label="Amount"
            value={newReimbursement.amount}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, amount: cleanDecimal(text) })}
            placeholder="Example: 12"
            keyboardType="decimal-pad"
          />
          <Input
            label="Receipt / Ticket No"
            value={newReimbursement.receiptNo}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, receiptNo: text })}
            placeholder="Optional ticket or receipt number"
          />

          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.optionRow}>
            {["Pending", "Submitted", "Reimbursed"].map((item) => (
              <OptionButton
                key={item}
                title={item}
                active={newReimbursement.status === item}
                onPress={() => setNewReimbursement({ ...newReimbursement, status: item })}
              />
            ))}
          </View>

          <Input
            label="Notes"
            value={newReimbursement.notes}
            onChangeText={(text) => setNewReimbursement({ ...newReimbursement, notes: text })}
            placeholder="Optional notes"
            multiline
          />

          <View style={styles.calculationBox}>
            <Text style={styles.calculationTitle}>Claim Calculation</Text>
            <InfoLine label="Parking / Salik" value={formatAED(["Parking", "Salik"].includes(newReimbursement.expenseType) ? newReimbursement.amount : 0)} />
            <InfoLine label="Total Transportation" value={formatAED(newReimbursement.expenseType === "Food & Accommodation" ? 0 : newReimbursement.amount)} />
            <InfoLine label="Food & Accommodation" value={formatAED(newReimbursement.expenseType === "Food & Accommodation" ? newReimbursement.amount : 0)} />
          </View>

          <Pressable style={styles.primaryButton} onPress={saveReimbursementRecord}>
            <Text style={styles.primaryButtonText}>{editingReimbursementId ? "Update Reimbursement" : "Save Reimbursement"}</Text>
          </Pressable>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "reimbursementReport") {
    return (
      <Page title="Reimbursement Report" subtitle="Monthly claim preview" onBack={goBack}>
        <View style={styles.editCard}>
          <MonthNav
            title={getMonthTitle(reimbursementReportMonth.year, reimbursementReportMonth.monthIndex)}
            onPrev={() => moveReimbursementReportMonth(-1)}
            onNext={() => moveReimbursementReportMonth(1)}
          />
          <View style={styles.dateRangeBox}>
            <Text style={styles.sectionMiniTitle}>Claim Date Range</Text>
            <Text style={styles.dateRangeHint}>Company cycle example: 24th to next month 23rd.</Text>
            <DatePickerField label="From Date" value={reimbursementReportFromDate} onChange={setReimbursementReportFromDate} placeholder="Select from date" />
            <DatePickerField label="To Date" value={reimbursementReportToDate} onChange={setReimbursementReportToDate} placeholder="Select to date" />
          </View>
          <View style={styles.reportSummaryBox}>
            <InfoLine label="Parking / Salik" value={formatAED(reimbursementReport.parkingSalikTotal)} />
            <InfoLine label="Other Transportation" value={formatAED(reimbursementReport.otherTransportationTotal)} />
            <InfoLine label="Total Transportation" value={formatAED(reimbursementReport.totalTransportation)} />
            <InfoLine label="Food & Accommodation" value={formatAED(reimbursementReport.foodAccommodationTotal)} />
            <InfoLine label="Total Claim" value={formatAED(reimbursementReport.totalClaim)} />
            <InfoLine label="Pending" value={formatAED(reimbursementReport.pendingTotal)} />
            <InfoLine label="Submitted" value={formatAED(reimbursementReport.submittedTotal)} />
            <InfoLine label="Reimbursed" value={formatAED(reimbursementReport.reimbursedTotal)} />
          </View>
          <Pressable style={styles.primaryButton} onPress={exportReimbursementExcel}>
            <Text style={styles.primaryButtonText}>Export Excel</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={exportReimbursementBcExcel}>
            <Text style={styles.secondaryButtonText}>Export BC Excel</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Report Records</Text>
        {reimbursementReport.records.length === 0 ? (
          <EmptyBox title="No records in selected period" text="Select another date range or add reimbursement records." />
        ) : null}
        <ReimbursementReportSection title="Parking / Salik / Transportation Expenses" records={reimbursementReport.transportRecords} />
        <ReimbursementReportSection title="Food & Accommodation Expenses" records={reimbursementReport.foodRecords} />
      </Page>
    );
  }

  if (isLoggedIn && screen === "backupRestore") {
    return (
      <Page title="Settings / Backup" subtitle="Security, backup and local app data" onBack={goBack}>
        <View style={styles.masterInfoCard}>
          <Text style={styles.masterInfoTitle}>DailyTask Backup</Text>
          <Text style={styles.masterInfoText}>
            Export creates one JSON backup file with your profile, attendance, tasks, petty cash, master data and reimbursement records. Save it in phone storage, Google Drive, Teams, WhatsApp or email. Import restores that file back into this app.
          </Text>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Backup Actions</Text>
          <Pressable style={styles.primaryButton} onPress={exportBackupJson}>
            <Text style={styles.primaryButtonText}>Export Backup JSON</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={importBackupJson}>
            <Text style={styles.secondaryButtonText}>Import / Restore Backup</Text>
          </Pressable>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Security Settings</Text>
          <InfoLine label="Biometric Login" value={biometricEnabled ? "Enabled" : "Disabled"} />
          <Text style={styles.masterInfoText}>
            Enable this to login with fingerprint, face unlock or your phone lock on this device. Username/password login will still work.
          </Text>
          {biometricEnabled ? (
            <Pressable style={styles.dangerSoftButton} onPress={disableBiometricLogin}>
              <Text style={styles.dangerSoftButtonText}>Disable Biometric Login</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={enableBiometricLogin}>
              <Text style={styles.primaryButtonText}>Enable Biometric Login</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Development Details</Text>
          <InfoLine label="Powered by" value="Crescent IT Solution" />
          <InfoLine label="Developed by" value="NousathAli" />
          <InfoLine label="Email" value="nousath24@hotmail.com" />
          <InfoLine label="App Mode" value="Local mobile storage" />
        </View>

        <View style={styles.editCard}>
          <Text style={styles.sectionMiniTitle}>Current Data Summary</Text>
          <InfoLine label="Attendance Records" value={String(attendanceRecords.length)} />
          <InfoLine label="Tasks" value={String(tasks.length)} />
          <InfoLine label="Petty Cash Expenses" value={String(pettyCashExpenses.length)} />
          <InfoLine label="Cash Received" value={String(cashReceivedRecords.length)} />
          <InfoLine label="Cash Transfers" value={String(cashTransfers.length)} />
          <InfoLine label="Reimbursement Records" value={String(reimbursementRecords.length)} />
          <InfoLine label="Companies" value={String(companyList.length)} />
          <InfoLine label="Suppliers" value={String(supplierList.length)} />
        </View>

        <View style={styles.emptySmallCard}>
          <Text style={styles.emptySmallTitle}>Local and cloud use</Text>
          <Text style={styles.emptySmallText}>
            This is a manual backup system. You can save the backup file locally on your phone or upload/share it to cloud apps like Google Drive, Teams, WhatsApp or email. This is different from live Firebase sync, which we will add later.
          </Text>
        </View>
      </Page>
    );
  }

  if (isLoggedIn && screen === "masterData") {
    const branchesForMasterCompany = companyBranchesData[newBranchCompany] || [];

    return (
      <Page title="Master Data" subtitle="Company, branch, BC branch code and supplier setup" onBack={goBack}>
        <View style={styles.masterInfoCard}>
          <Text style={styles.masterInfoTitle}>Clean Master Setup</Text>
          <Text style={styles.masterInfoText}>
            Manage company, branch, BC Branch / Entity Code and supplier names from one place. BC exports will use the selected BC Branch code in the Branch column.
          </Text>
        </View>

        <View style={styles.masterTabRow}>
          {["Company", "Branch", "BC Branch", "Supplier"].map((tab) => (
            <Pressable
              key={tab}
              style={[styles.masterTabButton, masterTab === tab && styles.masterTabButtonActive]}
              onPress={() => setMasterTab(tab)}
            >
              <Text style={[styles.masterTabButtonText, masterTab === tab && styles.masterTabButtonTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {masterTab === "Company" ? (
          <>
            <View style={styles.editCard}>
              <Text style={styles.sectionMiniTitle}>Add Company</Text>
              <Input
                label="Company Name"
                value={newCompanyName}
                onChangeText={setNewCompanyName}
                placeholder="Example: QSR / DTF / REINS"
                autoCapitalize="characters"
              />
              <Pressable style={styles.primaryButton} onPress={addCompanyMaster}>
                <Text style={styles.primaryButtonText}>Save Company</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Company List</Text>
            {companyList.length === 0 ? (
              <EmptyBox title="No companies yet" text="Add a company first." />
            ) : null}
            {companyList.map((company) => (
              <View key={company} style={styles.masterListCard}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.masterCompanyTitle}>{company}</Text>
                    <Text style={styles.masterCompanySub}>
                      {(companyBranchesData[company] || []).length} branches
                    </Text>
                  </View>
                  <Pressable style={styles.deleteMiniButton} onPress={() => deleteCompanyMaster(company)}>
                    <Text style={styles.deleteMiniButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {masterTab === "Branch" ? (
          <>
            <View style={styles.editCard}>
              <Text style={styles.sectionMiniTitle}>Add Branch</Text>
              <Text style={styles.inputLabel}>Select Company</Text>
              <View style={styles.optionRow}>
                {companyList.map((company) => (
                  <OptionButton
                    key={company}
                    title={company}
                    active={newBranchCompany === company}
                    onPress={() => setNewBranchCompany(company)}
                  />
                ))}
              </View>
              <Input
                label="Branch Name"
                value={newBranchName}
                onChangeText={setNewBranchName}
                placeholder="Example: MOE-DTF / GYU KAKU"
                autoCapitalize="characters"
              />
              <Pressable style={styles.primaryButton} onPress={addBranchMaster}>
                <Text style={styles.primaryButtonText}>Save Branch</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Branches under {newBranchCompany || "Company"}</Text>
            {!newBranchCompany ? (
              <EmptyBox title="Select company" text="Select a company to view branches." />
            ) : null}
            {newBranchCompany && branchesForMasterCompany.length === 0 ? (
              <EmptyBox title="No branches" text="No branches added under this company yet." />
            ) : null}
            {branchesForMasterCompany.map((branch) => (
              <View key={`${newBranchCompany}-${branch}`} style={styles.masterListCard}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.masterCompanyTitle}>{branch}</Text>
                    <Text style={styles.masterCompanySub}>{newBranchCompany}</Text>
                  </View>
                  <Pressable style={styles.deleteMiniButton} onPress={() => deleteBranchMaster(newBranchCompany, branch)}>
                    <Text style={styles.deleteMiniButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {masterTab === "BC Branch" ? (
          <>
            <View style={styles.editCard}>
              <Text style={styles.sectionMiniTitle}>Import BC Branch Excel</Text>
              <Pressable style={styles.primaryButton} onPress={importBcBranchExcel}>
                <Text style={styles.primaryButtonText}>Import Excel File</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={loadBuiltInBcBranchMaster}>
                <Text style={styles.secondaryButtonText}>Load Built-in Master</Text>
              </Pressable>
            </View>

            <View style={styles.editCard}>
              <Text style={styles.sectionMiniTitle}>Add BC Branch / Entity Code</Text>
              <Text style={styles.inputLabel}>Select Existing Company / Entity</Text>
              <View style={styles.optionRow}>
                {companyList.map((company) => (
                  <OptionButton
                    key={company}
                    title={company}
                    active={newBcBranchEntity === company}
                    onPress={() => setNewBcBranchEntity(company)}
                  />
                ))}
              </View>
              <Input
                label="Entity / Brand"
                value={newBcBranchEntity}
                onChangeText={(text) => setNewBcBranchEntity(text.toUpperCase())}
                placeholder="Example: DTF / CPR / UMAMI"
                autoCapitalize="characters"
              />
              <Input
                label="BC Branch / Entity Code"
                value={newBcBranchCode}
                onChangeText={(text) => setNewBcBranchCode(text.toUpperCase())}
                placeholder="Example: DTF-MOE / CPR-GROUP"
                autoCapitalize="characters"
              />
              <Input
                label="Display Name"
                value={newBcBranchName}
                onChangeText={setNewBcBranchName}
                placeholder="Example: Din Tai Fung MOE"
              />
              <Text style={styles.noteHelpText}>
                This code will be exported into the Business Central Branch column for Petty Cash and Reimbursement BC Excel.
              </Text>
              <Pressable style={styles.primaryButton} onPress={addBcBranchMaster}>
                <Text style={styles.primaryButtonText}>Save BC Branch Code</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>BC Branch Code List ({bcBranchList.length})</Text>

            <View style={styles.bcMasterSearchBox}>
              <Text style={styles.pettySearchTitle}>Search BC Branch Master</Text>
              <TextInput
                style={styles.pettySearchInput}
                placeholder="Search code, branch name or entity..."
                placeholderTextColor="#8BA2A8"
                value={bcBranchMasterSearch}
                onChangeText={setBcBranchMasterSearch}
                autoCapitalize="characters"
                returnKeyType="search"
              />
              <View style={styles.rowBetween}>
                <Text style={styles.pettySearchMeta}>
                  Showing {filteredBcBranchMasterList.length} of {bcBranchList.length} records
                </Text>
                {bcBranchMasterSearch.trim() ? (
                  <Pressable style={styles.pettySearchClearButton} onPress={() => setBcBranchMasterSearch("")}>
                    <Text style={styles.pettySearchClearText}>Clear</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {bcBranchList.length === 0 ? (
              <EmptyBox title="No BC branch codes" text="Add Business Central branch/entity codes here." />
            ) : null}
            {bcBranchList.length > 0 && filteredBcBranchMasterList.length === 0 ? (
              <EmptyBox title="No matching BC branch" text="Try another code, branch name or entity." />
            ) : null}

            <View style={styles.bcMasterListScrollBox}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
              >
                {filteredBcBranchMasterList.map((item) => (
                  <View key={item.id || item.code} style={styles.masterListCard}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.masterCompanyTitle}>{item.code}</Text>
                        <Text style={styles.masterCompanySub}>{item.entity} • {item.name || item.code}</Text>
                      </View>
                      <Pressable style={styles.deleteMiniButton} onPress={() => deleteBcBranchMaster(item.code)}>
                        <Text style={styles.deleteMiniButtonText}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : null}

        {masterTab === "Supplier" ? (
          <>
            <View style={styles.editCard}>
              <Text style={styles.sectionMiniTitle}>Add Supplier</Text>
              <Input
                label="Supplier Name"
                value={newSupplierName}
                onChangeText={setNewSupplierName}
                placeholder="Example: Al Ammar Hardware"
              />
              <Pressable style={styles.primaryButton} onPress={addSupplierMaster}>
                <Text style={styles.primaryButtonText}>Save Supplier</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Supplier List</Text>
            {supplierList.length === 0 ? (
              <EmptyBox title="No suppliers yet" text="Add supplier names here or type manually in petty cash expense." />
            ) : null}
            {supplierList.map((supplier) => (
              <View key={supplier} style={styles.masterListCard}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.masterCompanyTitle}>{supplier}</Text>
                    <Text style={styles.masterCompanySub}>Supplier</Text>
                  </View>
                  <Pressable style={styles.deleteMiniButton} onPress={() => deleteSupplierMaster(supplier)}>
                    <Text style={styles.deleteMiniButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        ) : null}
      </Page>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF5F7" />
      <ScrollView style={styles.dashboardScreen} showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardTop}>
          <Pressable style={styles.userTopBox} onPress={() => setScreen("profile")}>
            {currentUser?.profilePhotoUri ? (
              <Image source={{ uri: currentUser.profilePhotoUri }} style={styles.profilePhotoSmall} />
            ) : (
              <View style={styles.profileAvatarSmall}><Text style={styles.profileAvatarSmallText}>{getInitial()}</Text></View>
            )}
            <View><Text style={styles.greeting}>Hi, {getFirstName()}</Text><Text style={styles.dateText}>{getTodayDisplay()}</Text></View>
          </Pressable>
          <Pressable style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutText}>Logout</Text></Pressable>
        </View>

        <View style={styles.attendanceCard}>
          <View style={styles.rowBetween}>
            <View><Text style={styles.cardTitle}>Today Attendance</Text><Text style={styles.cardSubtitle}>{todayAttendance.dayType} • {todayAttendance.status}</Text></View>
            <Pressable style={styles.editButton} onPress={() => setScreen("attendance")}><Text style={styles.editButtonText}>Open</Text></Pressable>
          </View>
          <View style={styles.timeRow}>
            <TimeBox label="Clock In" value={todayAttendance.checkIn ? formatDisplayTime(todayAttendance.checkIn) : "--"} />
            <TimeBox label="Clock Out" value={todayAttendance.checkOut ? formatDisplayTime(todayAttendance.checkOut) : "--"} />
          </View>
          <View style={styles.clockButtonRow}>
            <Pressable style={styles.clockInButton} onPress={handleClockIn}><Text style={styles.clockInText}>Clock In</Text></Pressable>
            <Pressable style={styles.clockOutButton} onPress={handleClockOut}><Text style={styles.clockOutText}>Clock Out</Text></Pressable>
          </View>
          <Text style={styles.totalWorkedText}>Total Worked: {workedTimeText} • Extra Earned: {extraTimeText}</Text>
        </View>

        <Text style={styles.sectionTitle}>Today Summary</Text>
        <View style={styles.summaryGrid}>
          <SummaryCard title="Tasks" value={String(pendingTaskCount)} subtitle="Pending" onPress={() => setScreen("tasks")} />
          <SummaryCard title="Follow Ups" value={String(todayFollowUpCount)} subtitle="Need action" onPress={() => setScreen("tasks")} />
          <SummaryCard title="Petty Cash" value={formatAED(pettyTotals.cashWithMe)} subtitle="Cash with me" onPress={() => setScreen("pettyCash")} />
          <SummaryCard title="Transfer" value={formatAED(pettyTotals.cashInTransfer)} subtitle="Cash outside" onPress={() => setScreen("pettyCash")} />
        </View>

        <Text style={styles.sectionTitle}>My Activity</Text>
        <View style={styles.moduleList}>
          <ModuleCard title="Tasks" subtitle="Company and personal tasks" onPress={() => setScreen("tasks")} />
          <ModuleCard title="Attendance" subtitle="Duty, overtime, day off and PH balance" onPress={() => setScreen("attendance")} />
          <ModuleCard title="Petty Cash" subtitle="Cash received, invoices and transfers" onPress={() => setScreen("pettyCash")} />
          <ModuleCard title="Master Data" subtitle="Company, branch, BC code and supplier setup" onPress={() => setScreen("masterData")} />
          <ModuleCard title="Settings / Backup" subtitle="Biometric login, backup and restore" onPress={() => setScreen("backupRestore")} />
          <ModuleCard title="Profile" subtitle="View and update your account details" onPress={() => setScreen("profile")} />
          <ModuleCard title="Reimbursement" subtitle="Parking, Salik, transportation, food and accommodation claim" onPress={() => setScreen("reimbursement")} />
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
      <AppAlertHost />
    </SafeAreaView>
  );
}

function Page({ title, subtitle, onBack, rightText, onRight, children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF5F7" />
      <View style={styles.pageHeader}>
        <Pressable style={styles.headerBackButton} onPress={onBack}><Text style={styles.headerBackText}>‹</Text></Pressable>
        <View style={styles.pageHeaderTitleBox}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
        {rightText ? <Pressable style={styles.headerSmallButton} onPress={onRight}><Text style={styles.headerSmallButtonText}>{rightText}</Text></Pressable> : null}
      </View>
      <KeyboardAvoidingView
        style={styles.pageKeyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : androidTopPadding + 8}
      >
        <ScrollView
          style={styles.pageContent}
          contentContainerStyle={styles.pageScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
          {children}
          <Pressable style={styles.dashboardButton} onPress={onBack}><Text style={styles.dashboardButtonText}>Back</Text></Pressable>
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
      <AppAlertHost />
    </SafeAreaView>
  );
}

function Input({ label, multiline, style, ...props }) {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.noteInput, style]}
        placeholderTextColor="#9AA8B2"
        multiline={multiline}
        {...props}
      />
    </>
  );
}


function DatePickerField({ label, value, onChange, placeholder = "Select date", allowClear = false }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerDate = getPickerDateValue(value);

  function handleDateChange(event, selectedDate) {
    setShowPicker(false);
    if (event?.type === "dismissed") return;
    if (selectedDate) onChange(dateToKey(selectedDate));
  }

  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.pickerInput} onPress={() => setShowPicker(true)}>
        <Text style={[styles.pickerInputText, !value && styles.pickerPlaceholderText]}>
          {value ? formatDateForDisplay(value) : placeholder}
        </Text>
        <Text style={styles.pickerInputIcon}>📅</Text>
      </Pressable>
      <View style={styles.quickPickerRow}>
        <Pressable style={styles.quickPickerButton} onPress={() => onChange(getTodayKey())}>
          <Text style={styles.quickPickerButtonText}>Today</Text>
        </Pressable>
        {allowClear ? (
          <Pressable style={styles.quickPickerButtonLight} onPress={() => onChange("")}>
            <Text style={styles.quickPickerButtonTextLight}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      ) : null}
    </>
  );
}

function TimePickerField({ label, value, onChange, placeholder = "Select time", allowClear = false }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerTime = getPickerTimeValue(value);

  function handleTimeChange(event, selectedTime) {
    setShowPicker(false);
    if (event?.type === "dismissed") return;
    if (selectedTime) onChange(dateToTimeValue(selectedTime));
  }

  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.pickerInput} onPress={() => setShowPicker(true)}>
        <Text style={[styles.pickerInputText, !value && styles.pickerPlaceholderText]}>
          {value ? formatDisplayTime(value) : placeholder}
        </Text>
        <Text style={styles.pickerInputIcon}>🕒</Text>
      </Pressable>
      <View style={styles.quickPickerRow}>
        <Pressable style={styles.quickPickerButton} onPress={() => onChange(getCurrentTime24())}>
          <Text style={styles.quickPickerButtonText}>Now</Text>
        </Pressable>
        {allowClear ? (
          <Pressable style={styles.quickPickerButtonLight} onPress={() => onChange("")}>
            <Text style={styles.quickPickerButtonTextLight}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={pickerTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      ) : null}
    </>
  );
}

function SummaryCard({ title, value, subtitle, onPress }) {
  const content = (
    <>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summarySubtitle}>{subtitle}</Text>
      {onPress ? <Text style={styles.summaryOpenText}>Open ›</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable style={[styles.summaryCard, styles.summaryCardPressable]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={styles.summaryCard}>
      {content}
    </View>
  );
}

function ModuleCard({ title, subtitle, onPress }) {
  return (
    <Pressable style={styles.moduleCard} onPress={onPress}>
      <View style={styles.moduleIcon}><Text style={styles.moduleIconText}>•</Text></View>
      <View style={styles.moduleTextArea}><Text style={styles.moduleTitle}>{title}</Text><Text style={styles.moduleSubtitle}>{subtitle}</Text></View>
      <Text style={styles.moduleArrow}>›</Text>
    </Pressable>
  );
}

function ReimbursementReportSection({ title, records }) {
  if (!records || records.length === 0) return null;

  return (
    <View style={styles.reportSectionBlock}>
      <Text style={styles.reportSectionTitle}>{title}</Text>
      {records.map((record) => (
        <View key={record.id} style={styles.reportRowCard}>
          <Text style={styles.reportDate}>{formatDateForDisplay(record.date)}</Text>
          <Text style={styles.reportMainText}>{record.expenseType} • {formatAED(record.amount)}</Text>
          <Text style={styles.reportSubText}>Company: {record.company || "--"}</Text>
          <Text style={styles.reportSubText}>Branch: {record.branch || "--"}</Text>
          <Text style={styles.reportSubText}>Reason: {record.purpose || "--"}</Text>
          <Text style={styles.reportSubText}>Receipt: {record.receiptNo || "--"} • Status: {record.status}</Text>
          {record.claimNo ? <Text style={styles.reportSubText}>Claim: {record.claimNo}</Text> : null}
          {record.notes ? <Text style={styles.reportSubText}>Notes: {record.notes}</Text> : null}
          <View style={styles.reportAmountGrid}>
            <InfoLine label="Parking / Salik" value={formatAED(["Parking", "Salik"].includes(record.expenseType) ? record.amount : 0)} />
            <InfoLine label="Total Transportation" value={formatAED(record.expenseType === "Food & Accommodation" ? 0 : record.amount)} />
            <InfoLine label="Food & Accommodation" value={formatAED(record.expenseType === "Food & Accommodation" ? record.amount : 0)} />
          </View>
        </View>
      ))}
    </View>
  );
}

function SearchableBcBranchSelect({
  label,
  value,
  options,
  preferredCodes,
  onSelect,
  placeholder = "Search by code or branch name",
  emptyText = "No options found.",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];
  const safePreferredCodes = Array.isArray(preferredCodes) ? preferredCodes : [];
  const selectedCode = String(value || "").trim().toUpperCase();
  const selectedItem = safeOptions.find((item) => item.code === selectedCode);

  useEffect(() => {
    if (selectedItem) {
      setQuery(`${selectedItem.code} - ${selectedItem.name || selectedItem.code}`);
    } else if (selectedCode) {
      setQuery(selectedCode);
    } else {
      setQuery("");
    }
  }, [selectedCode, selectedItem?.code, selectedItem?.name]);

  const queryText = query.trim().toLowerCase();
  const preferredSet = new Set(safePreferredCodes);
  const sortedOptions = [...safeOptions].sort((a, b) => {
    const aPreferred = preferredSet.has(a.code) ? 0 : 1;
    const bPreferred = preferredSet.has(b.code) ? 0 : 1;
    if (aPreferred !== bPreferred) return aPreferred - bPreferred;
    return a.code.localeCompare(b.code);
  });

  const filteredOptions = sortedOptions
    .filter((item) => {
      if (!queryText) return true;

      const searchableText = [
        item.code,
        item.name,
        item.entity,
      ].join(" ").toLowerCase();

      return searchableText.includes(queryText);
    })
    .slice(0, 40);

  function handleTextChange(text) {
    setQuery(text);
    setOpen(true);
    if (!text.trim()) onSelect("");
  }

  function handleSelect(item) {
    onSelect(item.code);
    setQuery(`${item.code} - ${item.name || item.code}`);
    setOpen(false);
    Keyboard.dismiss();
  }

  return (
    <View style={styles.searchableDropdownWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.searchableDropdownInput}
        placeholder={placeholder}
        placeholderTextColor="#8BA2A8"
        value={query}
        onChangeText={handleTextChange}
        onFocus={() => setOpen(true)}
        autoCapitalize="characters"
        returnKeyType="search"
      />
      {selectedCode ? (
        <Pressable style={styles.searchableDropdownClearButton} onPress={() => handleTextChange("")}>
          <Text style={styles.searchableDropdownClearText}>Clear BC Branch Code</Text>
        </Pressable>
      ) : null}
      {open ? (
        <View style={styles.searchableDropdownMenu}>
          {filteredOptions.length > 0 ? (
            <ScrollView nestedScrollEnabled style={styles.searchableDropdownScroll} keyboardShouldPersistTaps="handled">
              {filteredOptions.map((item) => {
                const isActive = selectedCode === item.code;
                return (
                  <Pressable
                    key={item.id || item.code}
                    style={[styles.searchableDropdownOption, isActive && styles.searchableDropdownOptionActive]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.searchableDropdownCode, isActive && styles.searchableDropdownCodeActive]}>
                        {item.code}
                      </Text>
                      <Text style={styles.searchableDropdownName} numberOfLines={1}>
                        {item.name || item.code}
                      </Text>
                    </View>
                    <Text style={styles.searchableDropdownEntity}>{item.entity || "--"}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.dropdownEmptyText}>{emptyText}</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

function DropdownSelect({ label, value, placeholder, options, onSelect, emptyText }) {
  const [open, setOpen] = useState(false);
  const safeOptions = Array.isArray(options) ? options : [];

  function handleSelect(item) {
    onSelect(item);
    setOpen(false);
  }

  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.dropdownBox} onPress={() => setOpen(!open)}>
        <Text
          style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <View style={styles.dropdownIconCircle}>
          <Text style={styles.dropdownIcon}>{open ? "⌃" : "⌄"}</Text>
        </View>
      </Pressable>

      {open ? (
        <View style={styles.dropdownMenu}>
          {safeOptions.length > 0 ? (
            <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
              {safeOptions.map((item) => {
                const isActive = value === item;
                return (
                  <Pressable
                    key={item}
                    style={[styles.dropdownOption, isActive && styles.dropdownOptionActive]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[styles.dropdownOptionText, isActive && styles.dropdownOptionTextActive]}
                      numberOfLines={1}
                    >
                      {item}
                    </Text>
                    {isActive ? <Text style={styles.dropdownTick}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.dropdownEmptyText}>{emptyText || "No options found."}</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

function OptionButton({ title, active, onPress }) {
  return (
    <Pressable style={[styles.optionButton, active && styles.optionButtonActive]} onPress={onPress}>
      <Text style={[styles.optionButtonText, active && styles.optionButtonTextActive]}>{title}</Text>
    </Pressable>
  );
}

function TimeBox({ label, value }) {
  return (
    <View style={styles.timeBox}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.profileInfoRow}>
      <Text style={styles.profileInfoLabel}>{label}</Text>
      <Text style={styles.profileInfoValue}>{value}</Text>
    </View>
  );
}

function InfoLine({ label, value }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLineLabel}>{label}</Text>
      <Text style={styles.infoLineValue}>{value}</Text>
    </View>
  );
}

function MonthNav({ title, onPrev, onNext }) {
  return (
    <View style={styles.monthHeaderRow}>
      <Pressable style={styles.monthNavButton} onPress={onPrev}><Text style={styles.monthNavText}>‹</Text></Pressable>
      <View style={styles.monthTitleBox}><Text style={styles.sectionMiniTitle}>{title}</Text></View>
      <Pressable style={styles.monthNavButton} onPress={onNext}><Text style={styles.monthNavText}>›</Text></Pressable>
    </View>
  );
}

function EmptyBox({ title, text }) {
  return (
    <View style={styles.emptySmallCard}>
      <Text style={styles.emptySmallTitle}>{title}</Text>
      <Text style={styles.emptySmallText}>{text}</Text>
    </View>
  );
}

function normalizeTitleText(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ");
}


function isValidCompanyBranches(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.keys(value).every((company) => {
    const companyName = normalizeTitleText(company);
    return companyName && Array.isArray(value[company]);
  });
}

function mergeCompanyBranches(defaultBranches, savedBranches) {
  const merged = {};

  function addCompanyBranchList(source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) return;

    Object.keys(source).forEach((company) => {
      const companyName = normalizeTitleText(company).toUpperCase();
      if (!companyName) return;

      if (!merged[companyName]) merged[companyName] = [];

      const branches = Array.isArray(source[company]) ? source[company] : [];
      branches.forEach((branch) => {
        const branchName = normalizeTitleText(branch).toUpperCase();
        if (!branchName) return;

        const alreadyExists = merged[companyName].some(
          (existingBranch) => existingBranch.toLowerCase() === branchName.toLowerCase()
        );

        if (!alreadyExists) merged[companyName].push(branchName);
      });

      merged[companyName].sort((a, b) => a.localeCompare(b));
    });
  }

  addCompanyBranchList(defaultBranches);
  addCompanyBranchList(savedBranches);

  return merged;
}

function mergeSupplierLists(defaultSuppliers, savedSuppliers, expenseRecords) {
  const supplierMap = new Map();

  function addSupplierName(name) {
    const cleanName = normalizeTitleText(name);
    if (!cleanName) return;
    supplierMap.set(cleanName.toLowerCase(), cleanName);
  }

  if (Array.isArray(defaultSuppliers)) defaultSuppliers.forEach(addSupplierName);
  if (Array.isArray(savedSuppliers)) savedSuppliers.forEach(addSupplierName);
  if (Array.isArray(expenseRecords)) {
    expenseRecords.forEach((expense) => addSupplierName(expense?.supplier));
  }

  return Array.from(supplierMap.values()).sort((a, b) => a.localeCompare(b));
}

function getAttendanceMainType(dayType) {
  if (ATTENDANCE_LEAVE_TYPES.includes(dayType)) return "Day Off / Leave";
  if (ATTENDANCE_PH_TYPES.includes(dayType)) return "Public Holiday";
  if (dayType === "Off Cancelled") return "Off Cancelled";
  return "Work Day";
}

function getNonWorkingAttendanceTypes() {
  return [
    ...ATTENDANCE_LEAVE_TYPES,
    "PH Off",
    "PH Comp Off Taken",
  ];
}

function taskNeedsFollowUp(task) {
  if (task.status === "Completed") return false;
  const today = getTodayKey();
  if (task.followUpDate && task.followUpDate <= today) return true;
  if (task.dueDate && task.dueDate < today) return true;
  return false;
}

function getMonthSummary(records) {
  let workedDays = 0;
  let offDays = 0;
  let extraMinutes = 0;
  records.forEach((record) => {
    if (record.checkIn || record.checkOut || ["Work Day", "Off Cancelled", "PH Worked"].includes(record.dayType)) workedDays += 1;
    if (getNonWorkingAttendanceTypes().includes(record.dayType)) offDays += 1;
    if (record.checkIn && record.checkOut) extraMinutes += calculateExtraMinutes(record.checkIn, record.checkOut, record.normalDutyHours);
  });
  return { totalRecords: records.length, workedDays, offDays, extraMinutes };
}

function getCarryForwardBalance(records, year, monthIndex) {
  const selectedStartKey = dateToKey(new Date(year, monthIndex, 1));
  const selectedEndKey = dateToKey(new Date(year, monthIndex + 1, 0));
  let pendingOpening = 0;
  let phOpening = 0;
  let extraOpeningMinutes = 0;
  let pendingEarned = 0;
  let pendingUsed = 0;
  let phEarned = 0;
  let phUsed = 0;
  let phOffCount = 0;
  let extraEarnedMinutes = 0;
  let extraUsedMinutes = 0;

  records.forEach((record) => {
    const effect = getAttendanceBalanceEffect(record);
    if (record.date < selectedStartKey) {
      pendingOpening += effect.pendingEarned - effect.pendingUsed;
      phOpening += effect.phEarned - effect.phUsed;
      extraOpeningMinutes += effect.extraEarnedMinutes - effect.extraUsedMinutes;
    } else if (record.date >= selectedStartKey && record.date <= selectedEndKey) {
      pendingEarned += effect.pendingEarned;
      pendingUsed += effect.pendingUsed;
      phEarned += effect.phEarned;
      phUsed += effect.phUsed;
      phOffCount += effect.phOffCount;
      extraEarnedMinutes += effect.extraEarnedMinutes;
      extraUsedMinutes += effect.extraUsedMinutes;
    }
  });

  return {
    pendingOpening,
    pendingEarned,
    pendingUsed,
    pendingClosing: pendingOpening + pendingEarned - pendingUsed,
    phOpening,
    phEarned,
    phUsed,
    phClosing: phOpening + phEarned - phUsed,
    phOffCount,
    extraOpeningMinutes,
    extraEarnedMinutes,
    extraUsedMinutes,
    extraClosingMinutes: extraOpeningMinutes + extraEarnedMinutes - extraUsedMinutes,
  };
}

function getAttendanceBalanceEffect(record) {
  let pendingEarned = 0;
  let pendingUsed = 0;
  let phEarned = 0;
  let phUsed = 0;
  let phOffCount = 0;
  let extraEarnedMinutes = 0;
  let extraUsedMinutes = 0;
  if (record.dayType === "Off Cancelled") pendingEarned = 1;
  if (record.dayType === "Pending Off Taken") pendingUsed = 1;
  if (record.dayType === "PH Worked") phEarned = 1;
  if (record.dayType === "PH Comp Off Taken") phUsed = 1;
  if (record.dayType === "PH Off") phOffCount = 1;
  if (record.checkIn && record.checkOut) extraEarnedMinutes = calculateExtraMinutes(record.checkIn, record.checkOut, record.normalDutyHours);
  if (record.extraHoursUsed) extraUsedMinutes = hoursTextToMinutes(record.extraHoursUsed);
  return { pendingEarned, pendingUsed, phEarned, phUsed, phOffCount, extraEarnedMinutes, extraUsedMinutes };
}

function getRecordsForMonth(records, year, monthIndex) {
  return records
    .filter((record) => {
      const date = parseDateKey(record.date);
      return date.getFullYear() === year && date.getMonth() === monthIndex;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function calculateExpenseAmounts(expense) {
  const invoiceAmount = toNumber(expense.invoiceAmount);
  let amountExVat = 0;
  let vatAmount = 0;
  let totalAmount = invoiceAmount;
  if (expense.vatType === "VAT Included") {
    amountExVat = invoiceAmount / 1.05;
    vatAmount = invoiceAmount - amountExVat;
  }
  if (expense.vatType === "No VAT") {
    amountExVat = invoiceAmount;
    vatAmount = 0;
  }
  if (expense.vatType === "Manual VAT") {
    amountExVat = toNumber(expense.manualExVat);
    vatAmount = toNumber(expense.manualVat);
    totalAmount = amountExVat || vatAmount ? amountExVat + vatAmount : invoiceAmount;
  }
  return {
    invoiceAmount: roundMoney(invoiceAmount),
    amountExVat: roundMoney(amountExVat),
    vatAmount: roundMoney(vatAmount),
    totalAmount: roundMoney(totalAmount),
  };
}

function getPettyCashTotals(receivedRecords, expenseRecords, transferRecords) {
  const totalReceived = receivedRecords.reduce((sum, record) => sum + toNumber(record.amount), 0);
  const totalSpent = expenseRecords.reduce((sum, expense) => sum + toNumber(expense.totalAmount), 0);
  const transferOut = transferRecords.filter((t) => t.transferType === "Transfer Out").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const transferIn = transferRecords.filter((t) => t.transferType === "Transfer In").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const bookBalance = totalReceived - totalSpent;
  const cashInTransfer = transferOut - transferIn;
  const cashWithMe = bookBalance - cashInTransfer;
  return {
    totalReceived: roundMoney(totalReceived),
    totalSpent: roundMoney(totalSpent),
    transferOut: roundMoney(transferOut),
    transferIn: roundMoney(transferIn),
    bookBalance: roundMoney(bookBalance),
    cashInTransfer: roundMoney(cashInTransfer),
    cashWithMe: roundMoney(cashWithMe),
  };
}

function getNextDateKey(dateKey) {
  const sourceDate = parseDateKey(dateKey);
  sourceDate.setDate(sourceDate.getDate() + 1);
  return dateToKey(sourceDate);
}

function getLatestPettyClosing(closingRecords) {
  const safeClosings = Array.isArray(closingRecords) ? closingRecords : [];
  if (safeClosings.length === 0) return null;

  return [...safeClosings].sort((a, b) => {
    const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateCompare !== 0) return dateCompare;
    return Number(b.id || 0) - Number(a.id || 0);
  })[0] || null;
}

function filterRecordsFromDate(records, fromDate) {
  const safeRecords = Array.isArray(records) ? records : [];
  if (!fromDate) return safeRecords;
  return safeRecords.filter((record) => String(record.date || "") >= fromDate);
}

function getPettyCashOpenPeriodSummary(receivedRecords, expenseRecords, transferRecords, closingRecords) {
  const latestClosing = getLatestPettyClosing(closingRecords);
  const fromDate = latestClosing?.date ? getNextDateKey(latestClosing.date) : "";
  const periodReceived = filterRecordsFromDate(receivedRecords, fromDate);
  const periodExpenses = filterRecordsFromDate(expenseRecords, fromDate);
  const periodTransfers = filterRecordsFromDate(transferRecords, fromDate);

  return {
    latestClosing,
    fromDate,
    periodText: fromDate ? `Open period from ${formatDateForDisplay(fromDate)}` : "Open period from first petty cash entry",
    totals: getPettyCashTotals(periodReceived, periodExpenses, periodTransfers),
  };
}

function getPettyCashReport(receivedRecords, expenseRecords, transferRecords, year, monthIndex) {
  const range = getMonthDateRange(year, monthIndex);
  return getPettyCashReportByDateRange(receivedRecords, expenseRecords, transferRecords, range.from, range.to);
}

function getPettyCashReportByDateRange(receivedRecords, expenseRecords, transferRecords, fromDate, toDate) {
  const startKey = fromDate || getTodayKey();
  const endKey = toDate || startKey;
  const receivedBeforeRange = receivedRecords.filter((r) => r.date < startKey).reduce((sum, r) => sum + toNumber(r.amount), 0);
  const spentBeforeRange = expenseRecords.filter((e) => e.date < startKey).reduce((sum, e) => sum + toNumber(e.totalAmount), 0);
  const transferOutBeforeRange = transferRecords.filter((t) => t.date < startKey && t.transferType === "Transfer Out").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const transferInBeforeRange = transferRecords.filter((t) => t.date < startKey && t.transferType === "Transfer In").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const received = receivedRecords.filter((r) => isDateInRange(r.date, startKey, endKey)).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const expenses = expenseRecords.filter((e) => isDateInRange(e.date, startKey, endKey)).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const transfers = transferRecords.filter((t) => isDateInRange(t.date, startKey, endKey)).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const openingBookBalance = receivedBeforeRange - spentBeforeRange;
  const openingCashInTransfer = transferOutBeforeRange - transferInBeforeRange;
  const monthReceived = received.reduce((sum, r) => sum + toNumber(r.amount), 0);
  const monthSpent = expenses.reduce((sum, e) => sum + toNumber(e.totalAmount), 0);
  const monthTransferOut = transfers.filter((t) => t.transferType === "Transfer Out").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const monthTransferIn = transfers.filter((t) => t.transferType === "Transfer In").reduce((sum, t) => sum + toNumber(t.amount), 0);
  const closingBookBalance = openingBookBalance + monthReceived - monthSpent;
  const closingCashInTransfer = openingCashInTransfer + monthTransferOut - monthTransferIn;
  const closingCashWithMe = closingBookBalance - closingCashInTransfer;
  return {
    openingBookBalance: roundMoney(openingBookBalance),
    openingCashInTransfer: roundMoney(openingCashInTransfer),
    monthReceived: roundMoney(monthReceived),
    monthSpent: roundMoney(monthSpent),
    monthTransferOut: roundMoney(monthTransferOut),
    monthTransferIn: roundMoney(monthTransferIn),
    closingBookBalance: roundMoney(closingBookBalance),
    closingCashInTransfer: roundMoney(closingCashInTransfer),
    closingCashWithMe: roundMoney(closingCashWithMe),
    received,
    expenses,
    transfers,
  };
}

function getReimbursementReport(records, year, monthIndex) {
  const range = getMonthDateRange(year, monthIndex);
  return getReimbursementReportByDateRange(records, range.from, range.to);
}

function getReimbursementReportByDateRange(records, fromDate, toDate) {
  const startKey = fromDate || getTodayKey();
  const endKey = toDate || startKey;
  const rangeRecords = records
    .filter((record) => isDateInRange(record.date, startKey, endKey))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const transportRecords = rangeRecords
    .filter((record) => record.expenseType !== "Food & Accommodation")
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const foodRecords = rangeRecords
    .filter((record) => record.expenseType === "Food & Accommodation")
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const orderedRecords = [...transportRecords, ...foodRecords];

  const parkingSalikTotal = rangeRecords
    .filter((record) => ["Parking", "Salik"].includes(record.expenseType))
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const otherTransportationTotal = rangeRecords
    .filter((record) => record.expenseType === "Other Transportation")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const foodAccommodationTotal = foodRecords
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const totalTransportation = parkingSalikTotal + otherTransportationTotal;
  const totalClaim = totalTransportation + foodAccommodationTotal;
  const pendingTotal = rangeRecords
    .filter((record) => record.status === "Pending")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const submittedTotal = rangeRecords
    .filter((record) => record.status === "Submitted")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const reimbursedTotal = rangeRecords
    .filter((record) => record.status === "Reimbursed")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);

  return {
    records: orderedRecords,
    transportRecords,
    foodRecords,
    orderedRecords,
    parkingSalikTotal: roundMoney(parkingSalikTotal),
    otherTransportationTotal: roundMoney(otherTransportationTotal),
    foodAccommodationTotal: roundMoney(foodAccommodationTotal),
    totalTransportation: roundMoney(totalTransportation),
    totalClaim: roundMoney(totalClaim),
    pendingTotal: roundMoney(pendingTotal),
    submittedTotal: roundMoney(submittedTotal),
    reimbursedTotal: roundMoney(reimbursedTotal),
  };
}

function getMonthDateRange(year, monthIndex) {
  return {
    from: dateToKey(new Date(year, monthIndex, 1)),
    to: dateToKey(new Date(year, monthIndex + 1, 0)),
  };
}

function getCurrentMonthRange() {
  const today = new Date();
  return getMonthDateRange(today.getFullYear(), today.getMonth());
}

function getClaimDateRangeForMonth(year, monthIndex) {
  return {
    from: dateToKey(new Date(year, monthIndex - 1, 24)),
    to: dateToKey(new Date(year, monthIndex, 23)),
  };
}

function getDefaultClaimDateRange() {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  if (today.getDate() >= 24) {
    return {
      from: dateToKey(new Date(year, monthIndex, 24)),
      to: dateToKey(new Date(year, monthIndex + 1, 23)),
    };
  }
  return getClaimDateRangeForMonth(year, monthIndex);
}

function isDateInRange(dateKey, fromDate, toDate) {
  if (!dateKey) return false;
  const startKey = fromDate || dateKey;
  const endKey = toDate || dateKey;
  return String(dateKey) >= String(startKey) && String(dateKey) <= String(endKey);
}

function getDateRangeTitle(fromDate, toDate) {
  return `${formatDateForDisplay(fromDate)} to ${formatDateForDisplay(toDate)}`;
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function reimbursementFilterMatches(record, filter) {
  if (filter === "Food & Accommodation") return record.expenseType === "Food & Accommodation";
  if (filter === "Parking / Transport") return record.expenseType !== "Food & Accommodation";
  return true;
}

function appendReimbursementReportSection(rows, title, records) {
  if (!records || records.length === 0) return;
  rows.push([]);
  rows.push([title]);
  records.forEach((record) => {
    const isParkingSalik = ["Parking", "Salik"].includes(record.expenseType);
    const isFood = record.expenseType === "Food & Accommodation";
    rows.push([
      formatDateForDisplay(record.date),
      buildReimbursementDescription(record),
      isParkingSalik ? roundMoney(record.amount) : "",
      record.expenseType !== "Food & Accommodation" ? roundMoney(record.amount) : "",
      isFood ? roundMoney(record.amount) : "",
      record.company || "",
      record.branch || "",
      record.expenseType || "",
      record.receiptNo || "",
      record.status || "",
      record.notes || "",
    ]);
  });
  const sectionParkingSalik = records
    .filter((record) => ["Parking", "Salik"].includes(record.expenseType))
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const sectionTransportation = records
    .filter((record) => record.expenseType !== "Food & Accommodation")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const sectionFood = records
    .filter((record) => record.expenseType === "Food & Accommodation")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);

  rows.push([
    "",
    `${title} Total`,
    sectionParkingSalik ? roundMoney(sectionParkingSalik) : "",
    sectionTransportation ? roundMoney(sectionTransportation) : "",
    sectionFood ? roundMoney(sectionFood) : "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
}

function appendReimbursementClaimReportSection(rows, title, records) {
  if (!records || records.length === 0) return;
  rows.push([]);
  rows.push([title]);
  records.forEach((record) => {
    const isParkingSalik = ["Parking", "Salik"].includes(record.expenseType);
    const isFood = record.expenseType === "Food & Accommodation";
    rows.push([
      formatDateForDisplay(record.date),
      buildReimbursementDescription(record),
      isParkingSalik ? roundMoney(record.amount) : "",
      record.expenseType !== "Food & Accommodation" ? roundMoney(record.amount) : "",
      isFood ? roundMoney(record.amount) : "",
      record.company || "",
      record.branch || "",
      record.bcBranchCode || "",
      record.expenseType || "",
      record.receiptNo || "",
      record.status || "",
      record.notes || "",
    ]);
  });
  const sectionParkingSalik = records
    .filter((record) => ["Parking", "Salik"].includes(record.expenseType))
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const sectionTransportation = records
    .filter((record) => record.expenseType !== "Food & Accommodation")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);
  const sectionFood = records
    .filter((record) => record.expenseType === "Food & Accommodation")
    .reduce((sum, record) => sum + toNumber(record.amount), 0);

  rows.push([
    "",
    `${title} Total`,
    sectionParkingSalik ? roundMoney(sectionParkingSalik) : "",
    sectionTransportation ? roundMoney(sectionTransportation) : "",
    sectionFood ? roundMoney(sectionFood) : "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
}

function buildReimbursementDescription(record) {
  const parts = [];
  if (record.company) parts.push(record.company);
  if (record.branch) parts.push(record.branch);
  if (record.purpose) parts.push(record.purpose);
  if (record.expenseType) parts.push(record.expenseType);
  return parts.join(" - ");
}

function cleanDecimal(text) {
  return String(text).replace(/[^0-9.]/g, "");
}

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const numberValue = Number(String(value).replace(/,/g, "").trim());
  return Number.isNaN(numberValue) ? 0 : numberValue;
}

function roundMoney(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

function formatAED(value) {
  return `AED ${roundMoney(value).toFixed(2)}`;
}

function getTodayDisplay() {
  return new Date().toLocaleDateString("en-AE", { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
}

function getBase64EncodingValue() {
  return FileSystem.EncodingType?.Base64 || "base64";
}

function getUtf8EncodingValue() {
  return FileSystem.EncodingType?.UTF8 || "utf8";
}

async function readPickedFileAsBase64(fileUri, selectedFile, fileLabel = "import") {
  const base64Encoding = getBase64EncodingValue();
  const candidateUris = [];

  if (fileUri) candidateUris.push(fileUri);

  const extension = String(selectedFile?.name || "").toLowerCase().endsWith(".xls") ? "xls" : "xlsx";
  const safeName = String(selectedFile?.name || `${fileLabel}.${extension}`)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  const cacheRoot = FileSystem.cacheDirectory || FileSystem.documentDirectory;
  const copiedUri = `${cacheRoot}${Date.now()}_${safeName || `${fileLabel}.${extension}`}`;

  try {
    await FileSystem.copyAsync({ from: fileUri, to: copiedUri });
    candidateUris.unshift(copiedUri);
  } catch (copyError) {
    console.log("Excel import copy warning:", copyError?.message || copyError);
  }

  let lastError = null;

  for (const candidateUri of candidateUris) {
    try {
      const info = await FileSystem.getInfoAsync(candidateUri);
      if (!info?.exists) {
        lastError = new Error("Selected file was not available in app cache.");
        continue;
      }

      const fileBase64 = await FileSystem.readAsStringAsync(candidateUri, {
        encoding: base64Encoding,
      });

      if (fileBase64 && fileBase64.length > 20) {
        return fileBase64;
      }

      lastError = new Error("Selected file was empty or could not be read.");
    } catch (readError) {
      lastError = readError;
      console.log("Excel import read warning:", readError?.message || readError);
    }
  }

  throw lastError || new Error("Could not read selected file.");
}

function readWorkbookFromBase64(fileBase64) {
  const cleanBase64 = String(fileBase64 || "").replace(/^data:.*;base64,/, "");
  const attempts = [
    () => XLSX.read(cleanBase64, { type: "base64", WTF: false }),
    () => XLSX.read(cleanBase64.trim(), { type: "base64", WTF: false }),
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      const workbook = attempt();
      if (workbook?.SheetNames?.length) return workbook;
    } catch (error) {
      lastError = error;
      console.log("XLSX read warning:", error?.message || error);
    }
  }

  throw lastError || new Error("Excel workbook could not be opened.");
}

function getShortErrorMessage(error) {
  return String(error?.message || error || "Unknown error").slice(0, 180);
}

function getBcBranchEntityFromCode(code) {
  const cleanCode = String(code || "").trim().toUpperCase();
  if (!cleanCode) return "";
  const firstPart = cleanCode.split("-")[0] || "";
  return firstPart.trim().toUpperCase();
}

function normalizeExcelHeaderText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findBcBranchExcelColumnIndexes(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];

  for (let rowIndex = 0; rowIndex < Math.min(safeRows.length, 20); rowIndex += 1) {
    const row = Array.isArray(safeRows[rowIndex]) ? safeRows[rowIndex] : [];
    const normalizedHeaders = row.map((cell) => normalizeExcelHeaderText(cell));

    const codeIndex = normalizedHeaders.findIndex((header) => (
      ["code", "branchcode", "bccode", "dimensioncode", "dimensionvaluecode"].includes(header)
    ));

    const nameIndex = normalizedHeaders.findIndex((header) => (
      ["name", "branchname", "displayname", "description", "dimensionname", "dimensionvaluename"].includes(header)
    ));

    const entityIndex = normalizedHeaders.findIndex((header) => (
      ["entity", "brand", "company", "entitybrand"].includes(header)
    ));

    if (codeIndex >= 0 && nameIndex >= 0) {
      return {
        headerRowIndex: rowIndex,
        codeIndex,
        nameIndex,
        entityIndex,
      };
    }
  }

  return null;
}

function parseBcBranchExcelRows(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const indexes = findBcBranchExcelColumnIndexes(safeRows);

  if (!indexes) return [];

  const parsedRows = [];

  safeRows.slice(indexes.headerRowIndex + 1).forEach((row, index) => {
    const sourceRow = Array.isArray(row) ? row : [];
    const code = String(sourceRow[indexes.codeIndex] || "").trim().toUpperCase();
    const name = normalizeTitleText(sourceRow[indexes.nameIndex] || "");
    const rawEntity = indexes.entityIndex >= 0 ? sourceRow[indexes.entityIndex] : "";
    const entity = String(rawEntity || getBcBranchEntityFromCode(code)).trim().toUpperCase();

    if (!code || !name) return;

    parsedRows.push({
      id: `bc-import-${code}-${index}`,
      entity,
      code,
      name,
    });
  });

  const uniqueMap = new Map();
  parsedRows.forEach((item) => {
    uniqueMap.set(item.code, item);
  });

  return Array.from(uniqueMap.values()).sort((a, b) => {
    const entityCompare = a.entity.localeCompare(b.entity);
    return entityCompare !== 0 ? entityCompare : a.code.localeCompare(b.code);
  });
}

function normalizeBcBranchData(data) {
  const source = Array.isArray(data) ? data : [];
  return source
    .map((item, index) => {
      if (typeof item === "string") {
        const code = item.trim().toUpperCase();
        return { id: `bc-string-${code || index}`, entity: "", code, name: code };
      }

      const code = String(item?.code || item?.branchCode || "").trim().toUpperCase();
      if (!code) return null;

      return {
        id: item?.id || `bc-${code}`,
        entity: String(item?.entity || item?.company || getBcBranchEntityFromCode(code)).trim().toUpperCase(),
        code,
        name: String(item?.name || item?.displayName || code).trim(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const entityCompare = a.entity.localeCompare(b.entity);
      return entityCompare !== 0 ? entityCompare : a.code.localeCompare(b.code);
    });
}

function mergeBcBranchData(savedData) {
  const savedList = normalizeBcBranchData(savedData);
  const sourceList = savedList.length > 0
    ? savedList
    : normalizeBcBranchData(DEFAULT_BC_BRANCH_CODES);

  const mergedMap = new Map();

  sourceList.forEach((item) => {
    mergedMap.set(item.code, item);
  });

  return Array.from(mergedMap.values()).sort((a, b) => {
    const entityCompare = a.entity.localeCompare(b.entity);
    return entityCompare !== 0 ? entityCompare : a.code.localeCompare(b.code);
  });
}

function getRecordBcBranchValue(record) {
  return String(record?.bcBranchCode || record?.branch || "").trim();
}

function normalizeLocalProfile(profile) {
  const hasSavedProfile = profile && typeof profile === "object";
  const loadedProfile = {
    ...demoUser,
    ...(profile || {}),
  };

  const setupCompleted = typeof loadedProfile.profileSetupCompleted === "boolean"
    ? loadedProfile.profileSetupCompleted
    : Boolean(hasSavedProfile && loadedProfile.fullName && loadedProfile.fullName !== demoUser.fullName);

  return {
    ...loadedProfile,
    fullName: loadedProfile.fullName || demoUser.fullName,
    username: loadedProfile.username || demoUser.username,
    password: loadedProfile.password || demoUser.password,
    role: loadedProfile.role || demoUser.role,
    employeeId: loadedProfile.employeeId || "",
    profilePhotoUri: loadedProfile.profilePhotoUri || "",
    profileSetupCompleted: setupCompleted,
  };
}

function getFileExtensionFromUri(uri) {
  const cleanUri = String(uri || "").split("?")[0];
  const match = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : "jpg";
}


function formatDateForBc(dateKey) {
  if (!dateKey) return "";
  const parsedDate = parseDateKey(dateKey);
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
}

function getBcColumnWidths() {
  return [
    { wch: 12 },
    { wch: 22 },
    { wch: 14 },
    { wch: 24 },
    { wch: 16 },
    { wch: 52 },
    { wch: 26 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 26 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 16 },
    { wch: 18 },
    { wch: 22 },
    { wch: 14 },
    { wch: 26 },
    { wch: 22 },
    { wch: 18 },
    { wch: 22 },
  ];
}


function getReimbursementBcColumnWidths() {
  return getBcColumnWidths();
}

function buildPettyCashBcRows(expenses, profileData) {
  const rows = [BC_EXPORT_HEADERS];

  expenses.forEach((expense) => {
    const amountExVat = roundMoney(expense.amountExVat);
    const vatAmount = roundMoney(expense.vatAmount);
    const amountIncludingVat = roundMoney(expense.totalAmount || expense.invoiceAmount);
    const vatPercent = vatAmount > 0 ? 5 : 0;

    rows.push([
      "", // Line No.
      BC_FIXED_EXPENSE_CODE, // Expense Code remains blank for petty cash
      BC_FIXED_GL_NO,
      BC_FIXED_GL_DESCRIPTION,
      formatDateForBc(expense.date),
      expense.itemDescription || expense.notes || "",
      expense.supplier || "",
      BC_FIXED_GEN_BUS_POSTING_GROUP,
      BC_FIXED_VAT_BUS_POSTING_GROUP,
      BC_FIXED_GEN_PROD_POSTING_GROUP,
      getBcVatProdPostingGroup(vatAmount),
      amountExVat,
      BC_FIXED_LINE_AMOUNT,
      vatPercent,
      vatAmount,
      amountIncludingVat,
      getRecordBcBranchValue(expense),
      "", // Employee Code stays blank for BC
      expense.invoiceNumber || "",
      "", // VAT No.
      BC_FIXED_DEPARTMENT_CODE,
      "", // Accommodation Code
      BC_FIXED_ATTACHMENT,
      "", // Subtotal Excl. VAT (AED)
      "", // Total Excl. VAT (AED)
      "", // Total VAT (AED)
      "", // Total Incl. VAT (AED)
    ]);
  });

  return rows;
}

function buildReimbursementBcRows(records, profileData) {
  const rows = [REIMBURSEMENT_BC_EXPORT_HEADERS];

  records.forEach((record) => {
    const description = buildReimbursementDescription(record);
    const vatBreakdown = getReimbursementBcVatBreakdown(record);

    rows.push([
      "", // Line No.
      getReimbursementBcExpenseCode(record.expenseType),
      "", // G/L No.
      "", // G/L Description
      formatDateForBc(record.date),
      description,
      getReimbursementBcVendorName(record.expenseType),
      REIMBURSEMENT_BC_FIXED_GEN_BUS_POSTING_GROUP,
      REIMBURSEMENT_BC_FIXED_VAT_BUS_POSTING_GROUP,
      REIMBURSEMENT_BC_FIXED_GEN_PROD_POSTING_GROUP,
      vatBreakdown.vatProdPostingGroup,
      vatBreakdown.amountExVat,
      BC_FIXED_LINE_AMOUNT,
      vatBreakdown.vatPercent,
      vatBreakdown.vatAmount,
      vatBreakdown.amountIncludingVat,
      getRecordBcBranchValue(record),
      "", // Employee Code stays blank for BC
      record.receiptNo || "",
      "", // VAT No.
      REIMBURSEMENT_BC_FIXED_DEPARTMENT_CODE,
      "", // Accommodation Code
      REIMBURSEMENT_BC_FIXED_ATTACHMENT,
      "", // Subtotal Excl. VAT (AED)
      "", // Total Excl. VAT (AED)
      "", // Total VAT (AED)
      "", // Total Incl. VAT (AED)
    ]);
  });

  return rows;
}
const DAILY_DUTY_START_MINUTES = 8 * 60 + 30;
const DAILY_DUTY_END_MINUTES = 17 * 60 + 30;
const DAILY_DUTY_BREAK_MINUTES = 60;
const DAILY_DUTY_TIME_TEXT = "08:30 AM - 05:30 PM";
const DAILY_DUTY_DURATION_TEXT = "09:00";

function getTodayKey() {
  return dateToKey(new Date());
}

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  if (!dateKey) return new Date();
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonthTitle(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString("en-AE", { month: "long", year: "numeric" });
}

function formatDateForDisplay(dateKey) {
  if (!dateKey) return "--";
  return parseDateKey(dateKey).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });
}


function getPickerDateValue(value) {
  const parsedDate = value ? parseDateKey(value) : new Date();
  if (Number.isNaN(parsedDate.getTime())) return new Date();
  return parsedDate;
}

function getPickerTimeValue(value) {
  const now = new Date();
  if (!value || !isValidTime(value)) return now;
  const [hours, minutes] = value.split(":").map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
}

function dateToTimeValue(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getCurrentTime24() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function isValidTime(timeText) {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeText);
}

function formatDisplayTime(timeText) {
  if (!timeText) return "--";
  const [hourText, minuteText] = timeText.split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour) || !minuteText) return timeText;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minuteText} ${suffix}`;
}

function calculateWorkedTime(checkIn, checkOut) {
  const inMinutes = timeToMinutes(checkIn);
  const outMinutes = timeToMinutes(checkOut);
  if (inMinutes === null || outMinutes === null) return "--";
  let totalMinutes = outMinutes - inMinutes;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  return minutesToReadable(totalMinutes);
}

function calculateExtraTime(checkIn, checkOut, normalDutyHours) {
  return minutesToReadable(calculateExtraMinutes(checkIn, checkOut, normalDutyHours));
}

function calculateExtraMinutes(checkIn, checkOut, normalDutyHours) {
  const inMinutes = timeToMinutes(checkIn);
  const outMinutes = timeToMinutes(checkOut);
  const normalHours = Number(normalDutyHours);
  if (inMinutes === null || outMinutes === null || Number.isNaN(normalHours)) return 0;
  let totalMinutes = outMinutes - inMinutes;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  return Math.max(totalMinutes - normalHours * 60, 0);
}

function hoursTextToMinutes(hoursText) {
  const hours = Number(hoursText);
  return Number.isNaN(hours) ? 0 : Math.round(hours * 60);
}

function minutesToReadable(totalMinutes) {
  if (totalMinutes === null || Number.isNaN(totalMinutes)) return "--";
  const sign = totalMinutes < 0 ? "-" : "";
  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = Math.round(absoluteMinutes % 60);
  return `${sign}${hours}h ${minutes}m`;
}

function timeToMinutes(timeText) {
  if (!isValidTime(timeText)) return null;
  const [hours, minutes] = timeText.split(":").map(Number);
  return hours * 60 + minutes;
}

function getAttendanceTimesheetDateKeys(year, monthIndex) {
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();
  const lastDay = isCurrentMonth ? today.getDate() : new Date(year, monthIndex + 1, 0).getDate();
  const keys = [];

  for (let day = 1; day <= lastDay; day += 1) {
    keys.push(dateToKey(new Date(year, monthIndex, day)));
  }

  return keys.reverse();
}

function formatDateForTimesheet(dateKey) {
  const date = parseDateKey(dateKey);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function minutesToTimesheetText(totalMinutes) {
  if (totalMinutes === null || Number.isNaN(totalMinutes)) return "00:00";
  const absoluteMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getAttendanceDayCategory(record) {
  const type = record?.dayType || "Work Day";
  if (getNonWorkingAttendanceTypes().includes(type)) {
    return "off";
  }
  return "work";
}

function buildAttendanceTimesheetRow(record) {
  const checkInMinutes = timeToMinutes(record?.checkIn);
  const checkOutMinutes = timeToMinutes(record?.checkOut);
  const hasCheckIn = checkInMinutes !== null;
  const hasCheckOut = checkOutMinutes !== null;
  const isOffDay = getAttendanceDayCategory(record) === "off";

  if (isOffDay) {
    return {
      workTime: "00:00",
      late: "00:00",
      early: "00:00",
      overtime: "00:00",
      absentTime: "00:00",
      actualTime: "00:00",
      breakTime: "00:00",
      leaveTime: "00:00",
      exception: "",
    };
  }

  if (!hasCheckIn && !hasCheckOut) {
    return {
      workTime: "00:00",
      late: "00:00",
      early: "00:00",
      overtime: "00:00",
      absentTime: DAILY_DUTY_DURATION_TEXT,
      actualTime: "00:00",
      breakTime: "00:00",
      leaveTime: "00:00",
      exception: "1",
    };
  }

  if (!hasCheckIn || !hasCheckOut) {
    return {
      workTime: "00:00",
      late: hasCheckIn ? minutesToTimesheetText(Math.max(checkInMinutes - DAILY_DUTY_START_MINUTES, 0)) : "00:00",
      early: "00:00",
      overtime: "00:00",
      absentTime: "00:00",
      actualTime: "00:00",
      breakTime: "00:00",
      leaveTime: "00:00",
      exception: "1",
    };
  }

  let totalPunchMinutes = checkOutMinutes - checkInMinutes;
  if (totalPunchMinutes < 0) totalPunchMinutes += 24 * 60;

  const lateMinutes = Math.max(checkInMinutes - DAILY_DUTY_START_MINUTES, 0);
  const earlyMinutes = Math.max(DAILY_DUTY_END_MINUTES - checkOutMinutes, 0);
  const overtimeMinutes = Math.max(checkOutMinutes - DAILY_DUTY_END_MINUTES, 0);
  const breakMinutes = totalPunchMinutes > DAILY_DUTY_BREAK_MINUTES ? DAILY_DUTY_BREAK_MINUTES : 0;
  const workMinutes = Math.max(totalPunchMinutes - breakMinutes, 0);

  const actualStart = Math.max(checkInMinutes, DAILY_DUTY_START_MINUTES);
  const actualEnd = Math.min(checkOutMinutes, DAILY_DUTY_END_MINUTES);
  const actualRawMinutes = Math.max(actualEnd - actualStart, 0);
  const actualBreakMinutes = actualRawMinutes > DAILY_DUTY_BREAK_MINUTES ? DAILY_DUTY_BREAK_MINUTES : 0;
  const actualMinutes = Math.max(actualRawMinutes - actualBreakMinutes, 0);

  return {
    workTime: minutesToTimesheetText(workMinutes),
    late: minutesToTimesheetText(lateMinutes),
    early: minutesToTimesheetText(earlyMinutes),
    overtime: minutesToTimesheetText(overtimeMinutes),
    absentTime: "00:00",
    actualTime: minutesToTimesheetText(actualMinutes),
    breakTime: minutesToTimesheetText(breakMinutes),
    leaveTime: "00:00",
    exception: "",
  };
}

const androidTopPadding = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF5F7", paddingTop: androidTopPadding },
  darkSafeArea: { flex: 1, backgroundColor: "#0E3B43", paddingTop: androidTopPadding },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  loadingTitle: { fontSize: 36, fontWeight: "900", color: "#1597A5", marginBottom: 8 },
  loadingText: { color: "#7A8A99", fontSize: 14, fontWeight: "700" },
  welcomeScreen: { flex: 1, backgroundColor: "#EEF5F7", padding: 28, alignItems: "center", justifyContent: "center" },
  logoCircle: { width: 145, height: 145, borderRadius: 75, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", marginBottom: 28, shadowColor: "#0F3F45", shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 },
  logoText: { fontSize: 70, color: "#1597A5", fontWeight: "900" },
  appName: { fontSize: 38, fontWeight: "900", color: "#1597A5", marginBottom: 8 },
  welcomeTitle: { fontSize: 23, fontWeight: "900", color: "#17252A", marginBottom: 12 },
  welcomeSubtitle: { fontSize: 15, color: "#6D7F88", textAlign: "center", lineHeight: 24, marginBottom: 34 },
  welcomeFooter: { position: "absolute", bottom: 26, color: "#7A8A99", fontSize: 13, fontWeight: "800" },
  primaryButton: { backgroundColor: "#1597A5", paddingVertical: 15, paddingHorizontal: 22, borderRadius: 13, alignItems: "center", justifyContent: "center", marginTop: 12, shadowColor: "#1597A5", shadowOpacity: 0.22, shadowRadius: 10, elevation: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { backgroundColor: "#E7F1F3", paddingVertical: 15, borderRadius: 13, alignItems: "center", marginTop: 12 },
  secondaryButtonText: { color: "#1597A5", fontSize: 16, fontWeight: "800" },
  dashboardButton: { backgroundColor: "#FFFFFF", paddingVertical: 15, borderRadius: 15, alignItems: "center", marginTop: 14, borderWidth: 1, borderColor: "#DDE8EC" },
  dashboardButtonText: { color: "#17252A", fontSize: 15, fontWeight: "900" },
  dangerButton: { backgroundColor: "#FFE9DD", paddingVertical: 15, borderRadius: 15, alignItems: "center", marginTop: 14 },
  dangerButtonText: { color: "#C75B39", fontSize: 15, fontWeight: "900" },
  loginScreen: { flex: 1, backgroundColor: "#EEF5F7", padding: 28, justifyContent: "center" },
  loginCard: { backgroundColor: "#FFFFFF", borderRadius: 28, padding: 24, shadowColor: "#0F3F45", shadowOpacity: 0.08, shadowRadius: 22, elevation: 6 },
  loginTitle: { fontSize: 34, fontWeight: "900", color: "#1597A5" },
  loginSubtitle: { fontSize: 14, color: "#7A8A99", marginTop: 6, marginBottom: 20 },
  demoText: { textAlign: "center", color: "#7A8A99", fontSize: 13, marginTop: 18, fontWeight: "600" },
  modernWelcomeScreen: { flex: 1, backgroundColor: "#0E3B43", justifyContent: "center", alignItems: "center", paddingHorizontal: 24, overflow: "hidden" },
  welcomeContentWrap: { width: "100%", alignItems: "center", zIndex: 2 },
  brandBadge: { backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  brandBadgeText: { color: "#D8F4F6", fontSize: 12, fontWeight: "900", letterSpacing: 0.6 },
  heroLogoCircle: { width: 112, height: 112, borderRadius: 56, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 18, elevation: 8 },
  heroLogoText: { fontSize: 54, fontWeight: "900", color: "#0E8A96" },
  heroTitle: { fontSize: 30, fontWeight: "900", color: "#FFFFFF", textAlign: "center", marginBottom: 12 },
  heroSubtitle: { fontSize: 15, color: "#D2E7EA", textAlign: "center", lineHeight: 24, paddingHorizontal: 10, marginBottom: 26 },
  featureChipRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 28 },
  featureChip: { backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, margin: 5 },
  featureChipText: { color: "#E7F8F9", fontSize: 12, fontWeight: "900" },
  heroGetStartedButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 18, minWidth: 180, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 18, elevation: 8 },
  heroGetStartedButtonText: { color: "#0E3B43", fontSize: 16, fontWeight: "900" },
  designedFooter: { position: "absolute", bottom: 26, color: "#B9D5D9", fontSize: 13, fontWeight: "800", zIndex: 2 },
  developedFooter: {
    position: "absolute",
    bottom: 26,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  developedFooterSmall: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.75,
  },
  developedFooterName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
    opacity: 0.95,
  },
  motionBlobOne: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(27,188,204,0.14)", top: -35, left: -65 },
  motionBlobTwo: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(255,255,255,0.06)", bottom: -80, right: -70 },
  motionBlobThree: { position: "absolute", width: 130, height: 130, borderRadius: 65, backgroundColor: "rgba(255,255,255,0.05)", top: "33%", right: 30 },
  modernLoginScreen: { flex: 1, backgroundColor: "#0E3B43", paddingHorizontal: 24, overflow: "hidden" },
  loginScroll: { flex: 1, zIndex: 2 },
  loginScrollContent: { flexGrow: 1, justifyContent: "center", paddingTop: 82, paddingBottom: 96 },
  modernBackButton: { position: "absolute", top: 24, left: 20, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", zIndex: 5 },
  modernBackButtonText: { color: "#FFFFFF", fontSize: 34, marginTop: -5 },
  loginHeroWrap: { marginBottom: 22, zIndex: 2 },
  loginTopMini: { color: "#A8D4DA", fontSize: 13, fontWeight: "900", marginBottom: 6 },
  loginHeroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginBottom: 8 },
  loginHeroSub: { color: "#CBE2E5", fontSize: 14, lineHeight: 22, maxWidth: 320 },
  modernLoginCard: { backgroundColor: "#FFFFFF", borderRadius: 28, padding: 22, zIndex: 2, shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 18, elevation: 8 },
  modernInput: { backgroundColor: "#F5F8F9", borderWidth: 1, borderColor: "#E2ECEE", borderRadius: 14, paddingHorizontal: 15, paddingVertical: 14, fontSize: 15, color: "#17252A", marginBottom: 8 },
  modernLoginButton: { backgroundColor: "#0E8A96", paddingVertical: 15, borderRadius: 15, alignItems: "center", marginTop: 12 },
  modernLoginButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  forgotPasswordButton: { alignItems: "center", paddingTop: 14, paddingBottom: 4 },
  forgotPasswordText: { color: "#0E8A96", fontSize: 13, fontWeight: "900" },
  authLinkRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 14, gap: 10 },
  authLinkButton: { paddingHorizontal: 2, paddingVertical: 4 },
  authLinkText: { color: "#0E8A96", fontSize: 13, fontWeight: "900" },
  authLinkDivider: { color: "#B9C9CE", fontSize: 13, fontWeight: "900" },
  loginHelperText: { color: "#78909A", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 8, fontWeight: "700" },
  biometricLoginButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#F3FAFB", borderWidth: 1, borderColor: "#DCEFF2", paddingVertical: 13, borderRadius: 15, marginTop: 12 },
  biometricLoginIcon: { fontSize: 15, marginRight: 8 },
  biometricLoginText: { color: "#0E8A96", fontSize: 14, fontWeight: "900" },
  lockUserBox: { backgroundColor: "#F5F8F9", borderWidth: 1, borderColor: "#E2ECEE", borderRadius: 14, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 8 },
  lockUserText: { color: "#17252A", fontSize: 15, fontWeight: "900" },
  loginDesignedFooter: { position: "absolute", bottom: 26, alignSelf: "center", color: "#B9D5D9", fontSize: 13, fontWeight: "800", zIndex: 2 },
  loginDevelopedFooter: {
    position: "absolute",
    bottom: 26,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  loginBlobOne: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(27,188,204,0.12)", top: -40, right: -60 },
  loginBlobTwo: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,255,255,0.05)", bottom: -80, left: -70 },
  inputLabel: { fontSize: 13, fontWeight: "800", color: "#17252A", marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DDE8EC", borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15, color: "#17252A", marginBottom: 6 },
  noteInput: { minHeight: 90, textAlignVertical: "top" },
  dashboardScreen: { flex: 1, backgroundColor: "#EEF5F7", paddingHorizontal: 20 },
  dashboardTop: { paddingTop: 14, paddingBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userTopBox: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 },
  profileAvatarSmall: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#1597A5", alignItems: "center", justifyContent: "center", marginRight: 12 },
  profileAvatarSmallText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  profilePhotoSmall: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#DDE8EC" },
  greeting: { fontSize: 24, fontWeight: "900", color: "#17252A" },
  dateText: { fontSize: 13, color: "#7A8A99", marginTop: 3, fontWeight: "600" },
  logoutButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  logoutText: { color: "#1597A5", fontWeight: "900", fontSize: 13 },
  attendanceCard: { backgroundColor: "#DDF3F6", borderRadius: 24, padding: 18, shadowColor: "#0F3F45", shadowOpacity: 0.07, shadowRadius: 18, elevation: 4, marginBottom: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#17252A" },
  cardSubtitle: { fontSize: 13, color: "#55727B", marginTop: 4, fontWeight: "700" },
  editButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  editButtonText: { color: "#1597A5", fontWeight: "900", fontSize: 12 },
  timeRow: { flexDirection: "row", marginTop: 16, gap: 10 },
  timeBox: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14 },
  timeLabel: { fontSize: 12, color: "#7A8A99", fontWeight: "800" },
  timeValue: { fontSize: 18, color: "#17252A", fontWeight: "900", marginTop: 5 },
  clockButtonRow: { flexDirection: "row", marginTop: 14, gap: 12 },
  clockInButton: { flex: 1, backgroundColor: "#1597A5", paddingVertical: 12, borderRadius: 15, alignItems: "center" },
  clockOutButton: { flex: 1, backgroundColor: "#FFFFFF", paddingVertical: 12, borderRadius: 15, alignItems: "center" },
  clockInText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
  clockOutText: { color: "#1597A5", fontWeight: "900", fontSize: 14 },
  totalWorkedText: { color: "#55727B", fontSize: 13, fontWeight: "800", marginTop: 14 },
  pageHeader: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, flexDirection: "row", alignItems: "center" },
  pageHeaderTitleBox: { flex: 1 },
  headerBackButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", marginRight: 12 },
  headerBackText: { fontSize: 34, color: "#17252A", marginTop: -4 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#17252A" },
  headerSubtitle: { fontSize: 13, color: "#7A8A99", marginTop: 2 },
  headerSmallButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  headerSmallButtonText: { color: "#1597A5", fontSize: 13, fontWeight: "900" },
  pageContent: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "#17252A", marginTop: 24, marginBottom: 12 },
  sectionMiniTitle: { fontSize: 17, fontWeight: "900", color: "#17252A", marginBottom: 12 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  summaryCard: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 22, padding: 16, marginBottom: 12, shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  summaryCardPressable: { borderWidth: 1, borderColor: "#DDECEF" },
  summaryValue: { fontSize: 18, fontWeight: "900", color: "#1597A5" },
  summaryTitle: { fontSize: 14, color: "#17252A", fontWeight: "900", marginTop: 8 },
  summarySubtitle: { fontSize: 12, color: "#7A8A99", marginTop: 3, fontWeight: "600" },
  summaryOpenText: { color: "#1597A5", fontSize: 11, fontWeight: "900", marginTop: 8 },
  editCard: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginTop: 14, shadowColor: "#0F3F45", shadowOpacity: 0.06, shadowRadius: 18, elevation: 4 },
  moduleList: { marginBottom: 20 },
  moduleCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 15, marginBottom: 12, flexDirection: "row", alignItems: "center", shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  moduleIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E2F5F7", alignItems: "center", justifyContent: "center", marginRight: 13 },
  moduleIconText: { fontSize: 28, color: "#1597A5", fontWeight: "900", marginTop: -12 },
  moduleTextArea: { flex: 1 },
  moduleTitle: { fontSize: 15, fontWeight: "900", color: "#17252A" },
  moduleSubtitle: { fontSize: 12, color: "#7A8A99", marginTop: 3, fontWeight: "600" },
  moduleArrow: { fontSize: 28, color: "#9AA8B2", fontWeight: "700" },
  profileMainCard: { backgroundColor: "#FFFFFF", borderRadius: 28, padding: 24, alignItems: "center", shadowColor: "#0F3F45", shadowOpacity: 0.06, shadowRadius: 18, elevation: 4 },
  profilePhotoLargeWrap: { width: 106, height: 106, borderRadius: 53, alignItems: "center", justifyContent: "center", marginBottom: 16, backgroundColor: "#E2F5F7" },
  profilePhotoLarge: { width: 106, height: 106, borderRadius: 53, backgroundColor: "#DDE8EC" },
  profileAvatarLarge: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#1597A5", alignItems: "center", justifyContent: "center" },
  profileAvatarLargeText: { color: "#FFFFFF", fontSize: 38, fontWeight: "900" },
  profileName: { fontSize: 24, color: "#17252A", fontWeight: "900", textAlign: "center" },
  profileDesignation: { fontSize: 14, color: "#7A8A99", fontWeight: "700", marginTop: 6, textAlign: "center" },
  roleBadge: { backgroundColor: "#E2F5F7", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, marginTop: 14 },
  roleBadgeText: { color: "#1597A5", fontSize: 13, fontWeight: "900" },
  profilePhotoButtonRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  photoActionButton: { backgroundColor: "#1597A5", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  photoActionButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  photoRemoveButton: { backgroundColor: "#FFE9DD", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  photoRemoveButtonText: { color: "#C75B39", fontSize: 13, fontWeight: "900" },
  helpText: { color: "#6D7F88", fontSize: 13, fontWeight: "700", lineHeight: 20, marginBottom: 10 },
  lightWarningButton: { backgroundColor: "#FFF6DD", paddingVertical: 14, borderRadius: 15, alignItems: "center", marginTop: 10 },
  lightWarningButtonText: { color: "#B67A00", fontSize: 14, fontWeight: "900" },
  profileInfoRow: { borderBottomWidth: 1, borderBottomColor: "#EEF5F7", paddingVertical: 12 },
  profileInfoLabel: { fontSize: 12, color: "#7A8A99", fontWeight: "800", marginBottom: 4 },
  profileInfoValue: { fontSize: 15, color: "#17252A", fontWeight: "800" },
  emptySmallCard: { backgroundColor: "#EEF5F7", borderRadius: 16, padding: 14, marginTop: 10 },
  emptySmallTitle: { fontSize: 14, fontWeight: "900", color: "#17252A" },
  emptySmallText: { fontSize: 12, color: "#7A8A99", marginTop: 4, lineHeight: 18, fontWeight: "600" },
  taskAddHeroCard: {
    backgroundColor: "#0E3B43",
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0E3B43",
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 7,
  },
  taskAddHeroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  taskAddHeroIconText: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: -2 },
  taskAddHeroTextBox: { marginBottom: 14 },
  taskAddHeroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  taskAddHeroSub: { color: "#CBE2E5", fontSize: 13, lineHeight: 20, marginTop: 5, fontWeight: "700" },
  creativeAddTaskButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  creativeAddTaskButtonText: { color: "#0E3B43", fontSize: 15, fontWeight: "900" },
  taskCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 16, marginBottom: 12, shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  taskPageTopActions: { marginBottom: 12 },
  completedTaskButton: { backgroundColor: "#E7F1F3", borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14, alignItems: "center", borderWidth: 1, borderColor: "#D6E7EA" },
  completedTaskButtonText: { color: "#0E3B43", fontSize: 14, fontWeight: "900" },
  taskTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  taskEditIconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E7F1F3", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D6E7EA" },
  taskEditIconText: { color: "#0E3B43", fontSize: 17, fontWeight: "900" },
  taskTitle: { fontSize: 17, fontWeight: "900", color: "#17252A" },
  taskMeta: { fontSize: 12, color: "#7A8A99", marginTop: 4, fontWeight: "700" },
  taskInfo: { fontSize: 13, color: "#55727B", marginTop: 5, fontWeight: "700" },
  taskNotes: { fontSize: 13, color: "#6D7F88", lineHeight: 20, marginTop: 10 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8, gap: 8 },
  attendanceTypeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8, marginBottom: 12 },
  attendanceTypeButton: { backgroundColor: "#E7F1F3", borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14, minWidth: "47%", alignItems: "center", borderWidth: 1, borderColor: "#D6E7EA" },
  attendanceTypeButtonActive: { backgroundColor: "#0E3B43", borderColor: "#0E3B43" },
  attendanceTypeButtonText: { color: "#55727B", fontSize: 13, fontWeight: "900", textAlign: "center" },
  attendanceTypeButtonTextActive: { color: "#FFFFFF" },
  attendanceSubPanel: { backgroundColor: "#F5FAFB", borderRadius: 18, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#DDECEF" },
  selectedDayTypeBox: { backgroundColor: "#EAF6F7", borderRadius: 16, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: "#D6E7EA" },
  selectedDayTypeLabel: { color: "#6C838B", fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5 },
  selectedDayTypeValue: { color: "#0E3B43", fontSize: 16, fontWeight: "900", marginTop: 3 },
  searchableDropdownWrap: { marginTop: 6, marginBottom: 10, zIndex: 4 },
  searchableDropdownInput: {
    backgroundColor: "#F5F8F9",
    borderWidth: 1,
    borderColor: "#DDE8EC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#17252A",
    fontSize: 14,
    fontWeight: "800",
  },
  searchableDropdownMenu: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EC",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchableDropdownScroll: { maxHeight: 260 },
  searchableDropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF5F6",
    gap: 10,
  },
  searchableDropdownOptionActive: { backgroundColor: "#EAF7F8" },
  searchableDropdownCode: { color: "#17252A", fontSize: 14, fontWeight: "900" },
  searchableDropdownCodeActive: { color: "#0E8A96" },
  searchableDropdownName: { color: "#6B7C86", fontSize: 12, fontWeight: "700", marginTop: 2 },
  searchableDropdownEntity: { color: "#0E8A96", fontSize: 11, fontWeight: "900", backgroundColor: "#EAF7F8", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  searchableDropdownClearButton: { alignSelf: "flex-start", marginTop: 8, backgroundColor: "#F1F7F8", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  searchableDropdownClearText: { color: "#0E8A96", fontSize: 12, fontWeight: "900" },
  dropdownWrap: { marginTop: 6, marginBottom: 4 },
  dropdownBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
  },
  dropdownText: { color: "#17252A", fontSize: 15, fontWeight: "800", flex: 1, paddingRight: 10 },
  dropdownPlaceholder: { color: "#7A8A99", fontWeight: "700" },
  dropdownIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EAF5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownIcon: { color: "#1597A5", fontSize: 17, fontWeight: "900", marginTop: -2 },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EC",
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#0F3F45",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  dropdownScroll: { maxHeight: 190 },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownOptionActive: { backgroundColor: "#EAF8FA" },
  dropdownOptionText: { color: "#29444C", fontSize: 14, fontWeight: "800", flex: 1, paddingRight: 8 },
  dropdownOptionTextActive: { color: "#1597A5", fontWeight: "900" },
  dropdownTick: { color: "#1597A5", fontSize: 16, fontWeight: "900" },
  dropdownEmptyText: { color: "#7A8A99", fontSize: 13, fontWeight: "700", padding: 14, lineHeight: 19 },
  optionButton: { backgroundColor: "#E7F1F3", paddingHorizontal: 13, paddingVertical: 10, borderRadius: 13 },
  optionButtonActive: { backgroundColor: "#1597A5" },
  optionButtonText: { color: "#55727B", fontSize: 13, fontWeight: "900" },
  optionButtonTextActive: { color: "#FFFFFF" },
  monthHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  monthNavButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EEF5F7", alignItems: "center", justifyContent: "center" },
  monthNavText: { fontSize: 30, color: "#1597A5", fontWeight: "900", marginTop: -4 },
  monthTitleBox: { flex: 1, alignItems: "center" },
  historyRow: { backgroundColor: "#EEF5F7", borderRadius: 18, padding: 12, marginBottom: 10 },
  historyTitle: { fontSize: 14, color: "#17252A", fontWeight: "900" },
  historyText: { fontSize: 12, color: "#55727B", fontWeight: "700", marginTop: 3 },
  historyNote: { fontSize: 12, color: "#6D7F88", marginTop: 6, lineHeight: 18 },
  moneyCard: { backgroundColor: "#1597A5", borderRadius: 24, padding: 20, marginTop: 8, marginBottom: 16 },
  moneyCardLabel: { color: "#DDF3F6", fontSize: 13, fontWeight: "800" },
  moneyCardValue: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 6 },
  moneyCardSub: { color: "#DDF3F6", fontSize: 12, fontWeight: "700", marginTop: 8 },
  actionColumn: { gap: 10, marginTop: 8 },
  actionButton: { backgroundColor: "#E2F5F7", paddingVertical: 14, borderRadius: 15, alignItems: "center" },
  actionButtonText: { color: "#1597A5", fontSize: 14, fontWeight: "900" },
  actionButtonDark: { backgroundColor: "#1597A5", paddingVertical: 14, borderRadius: 15, alignItems: "center" },
  actionButtonDarkText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  actionButtonOrange: { backgroundColor: "#FFE9DD", paddingVertical: 14, borderRadius: 15, alignItems: "center" },
  actionButtonOrangeText: { color: "#C75B39", fontSize: 14, fontWeight: "900" },
  expenseCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  transferCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#FFE9DD", shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  expenseSupplier: { color: "#17252A", fontSize: 16, fontWeight: "900" },
  expenseDescription: { color: "#55727B", fontSize: 13, fontWeight: "700", marginTop: 3 },
  expenseAmount: { color: "#1597A5", fontSize: 15, fontWeight: "900" },
  amountDanger: { color: "#C75B39" },
  amountSuccess: { color: "#1597A5" },
  expenseMeta: { color: "#6D7F88", fontSize: 12, fontWeight: "700", marginTop: 6, lineHeight: 18 },
  receivedCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  receivedAmount: { color: "#1597A5", fontSize: 17, fontWeight: "900" },
  receivedMeta: { color: "#55727B", fontSize: 12, fontWeight: "700", marginTop: 4 },
  receivedNote: { color: "#6D7F88", fontSize: 12, marginTop: 6 },
  cardActionRow: { flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" },
  editMiniButton: { backgroundColor: "#E2F5F7", paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  editMiniButtonText: { color: "#1597A5", fontSize: 12, fontWeight: "900" },
  deleteMiniButton: { backgroundColor: "#FFE9DD", paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  deleteMiniButtonText: { color: "#C75B39", fontSize: 12, fontWeight: "900" },
  calculationBox: { backgroundColor: "#E2F5F7", borderRadius: 18, padding: 14, marginTop: 10, marginBottom: 8 },
  calculationTitle: { color: "#17252A", fontSize: 15, fontWeight: "900", marginBottom: 8 },
  infoLine: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.7)", paddingVertical: 7 },
  infoLineLabel: { color: "#55727B", fontSize: 13, fontWeight: "800", flex: 1 },
  infoLineValue: { color: "#17252A", fontSize: 13, fontWeight: "900", marginLeft: 10 },
  reportSummaryBox: { backgroundColor: "#E2F5F7", borderRadius: 18, padding: 14 },
  reportRowCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, shadowColor: "#0F3F45", shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 },
  reportDate: { color: "#1597A5", fontSize: 13, fontWeight: "900" },
  reportMainText: { color: "#17252A", fontSize: 16, fontWeight: "900", marginTop: 5 },
  reportSubText: { color: "#55727B", fontSize: 12, fontWeight: "700", marginTop: 4 },
  reportAmountGrid: { backgroundColor: "#EEF5F7", borderRadius: 14, padding: 10, marginTop: 10 },
  masterInfoCard: { backgroundColor: "#DDF3F6", borderRadius: 22, padding: 16, marginTop: 8, marginBottom: 4 },
  masterInfoTitle: { color: "#17252A", fontSize: 17, fontWeight: "900" },
  masterInfoText: { color: "#55727B", fontSize: 13, fontWeight: "700", marginTop: 6, lineHeight: 20 },
  masterTabRow: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 6, marginTop: 14, flexDirection: "row", gap: 6, shadowColor: "#0F3F45", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  masterTabButton: { flex: 1, paddingVertical: 11, borderRadius: 14, alignItems: "center", backgroundColor: "#EEF5F7" },
  masterTabButtonActive: { backgroundColor: "#1597A5" },
  masterTabButtonText: { color: "#55727B", fontSize: 12, fontWeight: "900" },
  masterTabButtonTextActive: { color: "#FFFFFF" },
  masterListCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginBottom: 10, shadowColor: "#0F3F45", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  masterCompanyTitle: { color: "#17252A", fontSize: 16, fontWeight: "900" },
  masterCompanySub: { color: "#7A8A99", fontSize: 12, fontWeight: "700", marginTop: 4 },
  setupHeroCard: { backgroundColor: "#0E3B43", borderRadius: 28, padding: 24, alignItems: "center", marginBottom: 16, overflow: "hidden" },
  setupAvatarCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  setupAvatarText: { fontSize: 34 },
  setupTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", textAlign: "center" },
  setupSubtitle: { color: "#CBE2E5", fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 22, marginTop: 8 },
  setupFooterText: { color: "#7A8A99", fontSize: 13, fontWeight: "700", textAlign: "center", marginTop: 10 },
  pickerInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE6EC",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerInputText: {
    color: "#17252A",
    fontSize: 15,
    fontWeight: "800",
  },
  pickerPlaceholderText: {
    color: "#9AA8B2",
    fontWeight: "700",
  },
  pickerInputIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  quickPickerRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  quickPickerButton: {
    backgroundColor: "#E8F8FA",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickPickerButtonText: {
    color: "#1597A5",
    fontSize: 12,
    fontWeight: "900",
  },
  quickPickerButtonLight: {
    backgroundColor: "#F3F6F8",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickPickerButtonTextLight: {
    color: "#637481",
    fontSize: 12,
    fontWeight: "900",
  },

  appPopupOverlay: {
    flex: 1,
    backgroundColor: "rgba(8,23,28,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  appPopupCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  appPopupIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E2F5F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appPopupIconText: { color: "#1597A5", fontSize: 28, fontWeight: "900" },
  appPopupTitle: { color: "#17252A", fontSize: 20, fontWeight: "900", textAlign: "center" },
  appPopupMessage: { color: "#5E717A", fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 21, marginTop: 8 },
  appPopupButtonRow: { flexDirection: "row", width: "100%", gap: 10, marginTop: 20, flexWrap: "wrap" },
  appPopupButton: { flex: 1, minWidth: 120, paddingVertical: 13, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  appPopupButtonPrimary: { backgroundColor: "#1597A5" },
  appPopupButtonLight: { backgroundColor: "#EEF5F7" },
  appPopupButtonDanger: { backgroundColor: "#FFE9DD" },
  appPopupButtonText: { fontSize: 14, fontWeight: "900" },
  appPopupButtonTextPrimary: { color: "#FFFFFF" },
  appPopupButtonTextLight: { color: "#17252A" },
  appPopupButtonTextDanger: { color: "#C75B39" },
  pageKeyboardWrap: { flex: 1 },
  pageScrollContent: { paddingBottom: 42 },
  dutySummaryHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 },
  dutySummarySub: { color: "#7A8A99", fontSize: 12, fontWeight: "700", marginTop: 3, maxWidth: 230 },
  dutySettingsButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EEF5F7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#DDE8EC" },
  dutySettingsButtonActive: { backgroundColor: "#1597A5", borderColor: "#1597A5" },
  dutySettingsIcon: { fontSize: 18, color: "#1597A5" },
  dutySettingsIconActive: { color: "#FFFFFF" },
  dutySettingsPanel: { backgroundColor: "#F5FAFB", borderRadius: 18, padding: 14, marginTop: 10, borderWidth: 1, borderColor: "#E1EDF0" },
  attendanceExportButton: { marginBottom: 18 },
  historyTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, marginBottom: 8 },
  historyCountText: { color: "#7A8A99", fontSize: 12, fontWeight: "900" },
  viewAllHistoryButton: { backgroundColor: "#0E3B43", borderRadius: 18, paddingVertical: 15, alignItems: "center", marginTop: 12, marginBottom: 8, borderWidth: 1, borderColor: "#1A6B74", shadowColor: "#0E3B43", shadowOpacity: 0.14, shadowRadius: 10, elevation: 3 },
  viewAllHistoryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  historyFilterSummary: { backgroundColor: "#F5FAFB", borderRadius: 16, padding: 12, marginTop: 6 },
  historyRowLarge: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#E8F0F2", shadowColor: "#0F3F45", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  securityDivider: { height: 1, backgroundColor: "#E2ECEE", marginVertical: 14 },
  poweredBadge: {
    position: "absolute",
    bottom: 26,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  loginPoweredBadge: {
    position: "absolute",
    bottom: 26,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  loginPoweredBadgeInline: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 18,
    marginBottom: 4,
  },
  poweredBadgeSmall: { color: "rgba(255,255,255,0.68)", fontSize: 9, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  poweredBadgeName: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", letterSpacing: 0.2, marginTop: 1 },
  pettySearchBox: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginTop: 12, marginBottom: 14, borderWidth: 1, borderColor: "#E1EDF0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  bcMasterSearchBox: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginTop: 8, marginBottom: 12, borderWidth: 1, borderColor: "#E1EDF0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  bcMasterListScrollBox: { maxHeight: 720, minHeight: 120, borderRadius: 18, overflow: "hidden", marginBottom: 10 },
  pettySearchTitle: { color: "#17252A", fontSize: 14, fontWeight: "900", marginBottom: 8 },
  pettySearchInput: { backgroundColor: "#F5F8F9", borderWidth: 1, borderColor: "#DDE8EC", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#17252A", fontSize: 14, fontWeight: "700", marginBottom: 8 },
  pettySearchMeta: { color: "#7A8A99", fontSize: 12, fontWeight: "700", flex: 1, paddingRight: 8 },
  pettySearchClearButton: { backgroundColor: "#EAF7F8", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7 },
  pettySearchClearText: { color: "#0E8A96", fontSize: 12, fontWeight: "900" },
  dateRangeBox: { backgroundColor: "#F5FAFB", borderRadius: 18, padding: 14, marginTop: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E1EDF0" },
  dateRangeHint: { color: "#7A8A99", fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 8 },
  filterPanel: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginTop: 12, marginBottom: 8, borderWidth: 1, borderColor: "#E8F0F2" },
  reportSectionBlock: { marginTop: 10 },
  reportSectionTitle: { color: "#0E3B43", fontSize: 15, fontWeight: "900", marginTop: 8, marginBottom: 10 },
  bottomSpace: { height: 30 },
});

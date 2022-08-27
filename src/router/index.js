import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConfDevices from '../views/Configuration/ConfDevices.vue'
import ConfGateways from '../views/Configuration/ConfGateways.vue'
import ConfMeter from '../views/Configuration/ConfMeter.vue'
import ConfwMBus from '../views/Configuration/ConfwMBus.vue'
import ConfIEC from '../views/Configuration/ConfIEC.vue'
import ConfLoRa from '../views/Configuration/ConfLoRa.vue'
import ConfUpload from '../views/Configuration/ConfUpload.vue'
import ConfDownload from '../views/Configuration/ConfDownload.vue'
import ConfSystem from '../views/Configuration/ConfSystem.vue'
import ConfWeb from '../views/Configuration/ConfWeb.vue'
import LoRaUplink from '../views/Collectors/LoRaUplink.vue'
import MBusRadio from '../views/Collectors/MBusRadio.vue'
import CollectorsIEC from '../views/Collectors/CollectorsIEC.vue'
import StatusSessions from '../views/Status/StatusSessions.vue'
import StatusTargets from '../views/Status/StatusTargets.vue'
import StatusConnections from '../views/Status/StatusConnections.vue'
import MonitoringSystem from '../views/Monitoring/MonitoringSystem.vue'
import MonitoringMessages from '../views/Monitoring/MonitoringMessages.vue'
import MonitoringIECGateways from '../views/Monitoring/MonitoringIECGateways.vue'
import MonitoringwMBusGateways from '../views/Monitoring/MonitoringwMBusGateways.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: "smf :: home",
      metaTags: [
        {
          name: 'This is the wonderful index page for the segw portal',
          content: 'Here you can find the most important elements'
        },
      ]
    },
  },
  {
    path: '/ConfDevices',
    name: 'ConfDevices',
    component: ConfDevices,
    meta: {
      title: "smf :: Devices",
    },
  },
  {
    path: '/ConfGateways',
    name: 'ConfGateways',
    component: ConfGateways,
    meta: {
      title: "smf :: Gateways",
    },
  },
  {
    path: '/ConfMeter',
    name: 'ConfMeter',
    component: ConfMeter,
    meta: {
      title: "smf :: Meter",
    },
  },
  {
    path: '/ConfwMBus',
    name: 'ConfwMBus',
    component: ConfwMBus,
    meta: {
      title: "smf :: wM-Bus",
    },
  },
  {
    path: '/ConfIEC',
    name: 'ConfIEC',
    component: ConfIEC,
    meta: {
      title: "smf :: IEC",
    },
  },
  {
    path: '/ConfLoRa',
    name: 'ConfLoRa',
    component: ConfLoRa,
    meta: {
      title: "smf :: LoRa",
    },
  },
  {
    path: '/ConfUpload',
    name: 'ConfUpload',
    component: ConfUpload,
    meta: {
      title: "smf :: Upload",
    },
  },
  {
    path: '/ConfDownload',
    name: 'ConfDownload',
    component: ConfDownload
    ,
    meta: {
      title: "smf :: Download",
    },
  },
  {
    path: '/ConfSystem',
    name: 'ConfSystem',
    component: ConfSystem,
    meta: {
      title: "smf :: System",
    },
  },
  {
    path: '/ConfWeb',
    name: 'ConfWeb',
    component: ConfWeb,
    meta: {
      title: "smf :: Web",
    },
  },
  {
    path: '/LoRaUplink',
    name: 'LoRaUplink',
    component: LoRaUplink,
    meta: {
      title: "smf :: Uplink",
    },
  },
  {
    path: '/MBusRadio',
    name: 'MBusRadio',
    component: MBusRadio,
    meta: {
      title: "smf :: MBusRadio",
    },
  },
  {
    path: '/CollectorsIEC',
    name: 'CollectorsIEC',
    component: CollectorsIEC
    ,
    meta: {
      title: "smf :: IEC",
    },
  },
  {
    path: '/StatusConnections',
    name: 'StatusConnections',
    component: StatusConnections,
    meta: {
      title: "smf :: Connections",
    },
  },
  {
    path: '/StatusSessions',
    name: 'StatusSessions',
    component: StatusSessions,
    meta: {
      title: "smf :: Sessions",
    },
  },
  {
    path: '/StatusTargets',
    name: 'StatusTargets',
    component: StatusTargets,
    meta: {
      title: "smf :: Targets",
    },
  },
  {
    path: '/MonitoringSystem',
    name: 'MonitoringSystem',
    component: MonitoringSystem,
    meta: {
      title: "smf :: System",
    },
  },
  {
    path: '/MonitoringMessages',
    name: 'MonitoringMessages',
    component: MonitoringMessages,
    meta: {
      title: "smf :: Messages",
    },
  },
  {
    path: '/MonitoringIECGateways',
    name: 'MonitoringIECGateways',
    component: MonitoringIECGateways,
    meta: {
      title: "smf :: IEC-Gateways",
    },
  },
  {
    path: '/MonitoringwMBusGateways',
    name: 'MonitoringwMBusGateways',
    component: MonitoringwMBusGateways,
    meta: {
      title: "smf :: wM-Bus Gateways",
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// set page title and additional Meta tags if needed
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  if(!nearestWithMeta) return next();
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router

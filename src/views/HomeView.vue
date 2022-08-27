<template>
  <div class="home bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-dashboard') }}</h1>
      <p>{{ $t('lead-dashboard') }}</p>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-01') }}</h5>
            <p class="card-text">{{ $t('config-home-01a') }}</p>
            <router-link :to="{ name: 'ConfDevices' }" class="btn btn-primary">{{ $t('nav-devices') }} </router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-device", { count: deviceCount })
            }}</small>
          </div>
        </div>
      </div>               
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-02') }}</h5>
            <p class="card-text">{{ $t('config-home-02a') }}</p>
            <router-link :to="{ name: 'ConfGateways' }" class="btn btn-primary">{{ $t('nav-gateways') }}</router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-gateway", { count: gatewayCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-03') }}</h5>
            <p class="card-text">{{ $t('config-home-03a') }}</p>
            <router-link :to="{ name: 'ConfMeter' }" class="btn btn-primary">{{ $t('nav-meter') }}</router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-meter", { count: meterCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-04') }}</h5>
            <p class="card-text">{{ $t('config-home-04a') }}</p>
            <router-link :to="{ name: 'StatusSessions' }" class="btn btn-primary">{{ $t('nav-sessions') }}</router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-status-session", { count: sessionCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-05') }}</h5>
            <p class="card-text">{{ $t('config-home-05a') }}</p>
            <router-link :to="{ name: 'StatusTargets' }" class="btn btn-primary">{{ $t('nav-targets') }}</router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-status-targets", { count: targetCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-home-06') }}</h5>
            <p class="card-text">{{ $t('config-home-06a') }}</p>
            <router-link :to="{ name: 'StatusConnections' }" class="btn btn-primary">{{ $t('nav-connections') }}</router-link>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-status-connections", { count: connectionCount })
            }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
h1 {
  font-size: 75px;
}
</style>

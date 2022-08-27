<template>
  <div class="ConfWeb bg-light py-5">
    <div class="container">
      <h1>Configure the Web-Interface</h1>
      <p> data path: wss://segw.ch:</p>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-6">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">SSL/TSL available</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
              <label class="form-check-label" for="flexSwitchCheckDefault">Enable SSL/TLS encryption (HTTPs) </label>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>false</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">HTTPS Rewrite</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">Redirect to HTTPS (if available)</label>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>false</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">Session Timeout (HTTP)</h5>
            <div class="input-group">
              <div class="input-group-text">sec.</div>
              <input type="number" value="30" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>30 seconds</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">Maximum Upload Size (HTTP)</h5>
            <div class="input-group">
              <div class="input-group-text">10 MB.</div>
              <input type="number" value="10485760" min="1024" max="10485760" step="1024" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>10 MB</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">Session Timeout (HTTPS)</h5>
            <div class="input-group">
              <div class="input-group-text">sec.</div>
              <input type="number" value="30" min="10" max="10000" step="10" class="form-control" disabled>
              <button class="btn btn-secondary" disabled>{{ $t('com-default') }}</button>
              <button class="btn btn-success" disabled>{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>30 seconds</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">Maximum Upload Size (HTTPS)</h5>
            <div class="input-group">
              <div class="input-group-text">10 MB.</div>
              <input type="number" value="10485760" min="1024" max="10485760" step="1024" class="form-control" disabled>
              <button class="btn btn-secondary" disabled>{{ $t('com-default') }}</button>
              <button class="btn btn-success" disabled>{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>10 MB</b>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
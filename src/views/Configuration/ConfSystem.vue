<template>
  <div class="ConfSystem bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-system') }}</h1>
      <p>{{
          $t("lead-system")
      }} </p>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card card-medium mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-01') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-02') }}</label>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>false</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card card-medium mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-03') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-04') }}</label>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>true</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card card-medium mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-05') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-06') }}</label>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>true</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card card-medium mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-18') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-19') }}</label>
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
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-14') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-15') }}</label>
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
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-16') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked>
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('config-sys-17') }}</label>
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
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-07') }}</h5>
            <div class="input-group">
              <select class="form-select">
                <option selected>Open this select menu</option>
                <option value="1">{{ $t('config-sys-c1') }}</option>
                <option value="2">{{ $t('config-sys-c2') }}</option>
                <option value="3">{{ $t('config-sys-c3') }}</option>
                <option value="3">{{ $t('config-sys-c4') }}</option>
                <option value="3">{{ $t('config-sys-c5') }}</option>
                <option value="3">{{ $t('config-sys-c6') }}</option>
                <option value="3">{{ $t('config-sys-c7') }}</option>
                <option value="3">{{ $t('config-sys-c8') }}</option>
                <option value="3">{{ $t('config-sys-c9') }}</option>
              </select>

              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              default = AUT
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-08') }}</h5>
            <div class="input-group">
              <select class="form-select">
                <option selected>Open this select menu</option>
                <option value="1">english</option>
                <option value="2">deutsch</option>
                <option value="3">español</option>
                <option value="3">français</option>
                <option value="3">Русский</option>
              </select>
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              default = en-GB
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-09') }}</h5>
            <div class="input-group">
              <div class="input-group-text">max</div>
              <input type="number" value="1000" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>1000</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-10') }}</h5>
            <div class="input-group">
              <div class="input-group-text">max</div>

              <input type="number" value="2000" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>2000</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-20') }}</h5>
            <div class="input-group">
              <div class="input-group-text">max</div>
              <input type="number" value="500" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>500</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-21') }}</h5>
            <div class="input-group">
              <div class="input-group-text">max</div>

              <input type="number" value="500" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>500</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-22') }}</h5>
            <div class="input-group">
              <div class="input-group-text">max</div>

              <input type="number" value="600" min="10" max="10000" step="10" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-success">{{ $t('action-apply') }} </button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>600</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-11') }}</h5>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
              {{ $t('config-sys-12') }} <b>/</b>
              {{ $t('config-sys-13') }}
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>false</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card card-long mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('config-sys-23') }}</h5>
            <div class="input-group">
              <div class="input-group-text">minutes</div>

              <input type="number" value="30" min="10" max="120" step="5" class="form-control">
              <button class="btn btn-secondary">{{ $t('com-default') }}</button>
              <button class="btn btn-danger">{{ $t("action-apply-force") }}</button>
            </div>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{ $t('com-default') }} = <b>({{
                  $t("config-sys-footer-23")
              }})</b>
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 mb-4">
        <div class="card card-long mt-4 shadow">
          <div class="card-header bg-info">
            <h5 class="card-title">{{ $t('config-sys-28') }}</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">{{ $t("config-sys-24") }}</li>
            <li class="list-group-item">{{ $t("config-sys-25") }}</li>
            <li class="list-group-item">{{ $t("config-sys-26") }}</li>
            <li class="list-group-item">{{ $t("config-sys-27") }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

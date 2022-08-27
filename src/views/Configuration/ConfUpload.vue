<template>
  <div class="ConfUpload bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-upload') }}</h1>
      <p>{{ $t('lead-upload') }}</p>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card  mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('upload-title-01') }}</h5>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio1" value="Append"
                  checked>
                <label class="form-check-label" for="deviceRadio1">{{ $t('upload-radio-1') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio2" value="Merge">
                <label class="form-check-label" for="deviceRadio2">{{ $t('upload-radio-2') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio3"
                  value="Overwrite">
                <label class="form-check-label" for="deviceRadio3">{{ $t('upload-radio-3') }}</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <!-- Radio row 2 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions2" id="deviceRadio4"
                  value="Version-3.2">
                <label class="form-check-label" for="deviceRadio4">Version 3.2</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions2" id="deviceRadio5"
                  value="Version-4.0">
                <label class="form-check-label" for="deviceRadio5">Version 4.0</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions2" id="deviceRadio6"
                  value="Version-0.9" checked>
                <label class="form-check-label" for="deviceRadio6">Version 0.9</label>
              </div>
            </div>
            <!-- Radio row 2 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('upload-button-1') }} ⇪</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('upload-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-device", { count: deviceCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card  mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('upload-title-02') }}</h5>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio1" value="Append"
                  checked>
                <label class="form-check-label" for="deviceRadio1">{{ $t('upload-radio-1') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio2" value="Merge">
                <label class="form-check-label" for="deviceRadio2">{{ $t('upload-radio-2') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio3"
                  value="Overwrite">
                <label class="form-check-label" for="deviceRadio3">{{ $t('upload-radio-3') }}</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('upload-button-1') }} ⇪</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('upload-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-gateway", { count: gatewayCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card  mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('upload-title-03') }}</h5>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio1" value="Append"
                  checked>
                <label class="form-check-label" for="deviceRadio1">{{ $t('upload-radio-1') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio2" value="Merge">
                <label class="form-check-label" for="deviceRadio2">{{ $t('upload-radio-2') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio3"
                  value="Overwrite">
                <label class="form-check-label" for="deviceRadio3">{{ $t('upload-radio-3') }}</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('upload-button-1') }} ⇪</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('upload-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-meter", { count: deviceMeter })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card  mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('upload-title-04') }}</h5>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio1" value="Append"
                  checked>
                <label class="form-check-label" for="deviceRadio1">{{ $t('upload-radio-1') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio2" value="Merge">
                <label class="form-check-label" for="deviceRadio2">{{ $t('upload-radio-2') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio3"
                  value="Overwrite">
                <label class="form-check-label" for="deviceRadio3">{{ $t('upload-radio-3') }}</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('upload-button-1') }} ⇪</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('upload-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-LoRa", { LoRaCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('upload-title-05') }}</h5>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile">
            </div>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio1" value="Append"
                  checked>
                <label class="form-check-label" for="deviceRadio1">{{ $t('upload-radio-1') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio2" value="Merge">
                <label class="form-check-label" for="deviceRadio2">{{ $t('upload-radio-2') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio3"
                  value="Overwrite">
                <label class="form-check-label" for="deviceRadio3">{{ $t('upload-radio-3') }}</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('upload-button-1') }} ⇪</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('upload-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{ iecCount }} IEC and {{ wmbusCount }} wM-Bus meters(s)
              configured</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

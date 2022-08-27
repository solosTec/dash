<template>
  <div class="ConfDownload bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-download') }}</h1>
      <p>{{
          $t("lead-download")
      }} </p>
    </div>
  </div>
  <div class="container-fluid">
    <h2 class="pt-3">{{ $t('download-undertitle-1') }}</h2>
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-1') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio1" value="xml">
                <label class="form-check-label" for="deviceRadio1">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio2" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio2">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions1" id="deviceRadio3" value="csv">
                <label class="form-check-label" for="deviceRadio3">CSV</label>
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
                  value="Version-5.0" checked>
                <label class="form-check-label" for="deviceRadio6">Version 5.0</label>
              </div>
            </div>
            <!-- Radio row 2 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-device", { count: deviceCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-2') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio7" value="xml">
                <label class="form-check-label" for="deviceRadio7">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio8" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio8">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions3" id="deviceRadio9" value="csv">
                <label class="form-check-label" for="deviceRadio9">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-meter", { meterCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-3') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio10" value="xml">
                <label class="form-check-label" for="deviceRadio10">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio11" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio11">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions4" id="deviceRadio12" value="csv">
                <label class="form-check-label" for="deviceRadio12">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              meters available</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-4') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio13" value="xml">
                <label class="form-check-label" for="deviceRadio13">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio14" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio14">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions5" id="deviceRadio15" value="csv">
                <label class="form-check-label" for="deviceRadio15">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: gatewayCount })
              }}
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-5') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio16" value="xml">
                <label class="form-check-label" for="deviceRadio16">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio17" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio17">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions6" id="deviceRadio18" value="csv">
                <label class="form-check-label" for="deviceRadio18">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <!-- Radio row 2 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions7" id="deviceRadio19"
                  value="Actility">
                <label class="form-check-label" for="deviceRadio19">Actility</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions7" id="deviceRadio20"
                  value="Swisscom" checked>
                <label class="form-check-label" for="deviceRadio20">Swisscom</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions7" id="deviceRadio21"
                  value="SigFox">
                <label class="form-check-label" for="deviceRadio21">SigFox</label>
              </div>
            </div>
            <!-- Radio row 2 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: gatewayCount })
              }}
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-6') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions8" id="deviceRadio22" value="xml">
                <label class="form-check-label" for="deviceRadio22">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions8" id="deviceRadio23" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio23">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions8" id="deviceRadio24" value="csv">
                <label class="form-check-label" for="deviceRadio24">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: gatewayCount })
              }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="container-fluid">
    <h2 class="pt-3">{{ $t('download-undertitle-2') }}</h2>
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-1') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions9" id="deviceRadio25" value="xml">
                <label class="form-check-label" for="deviceRadio25">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions9" id="deviceRadio26" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio26">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions9" id="deviceRadio27" value="csv">
                <label class="form-check-label" for="deviceRadio27">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-device", { count: deviceCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-8') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions11" id="deviceRadio28" value="xml">
                <label class="form-check-label" for="deviceRadio28">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions11" id="deviceRadio29" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio29">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions11" id="deviceRadio30" value="csv">
                <label class="form-check-label" for="deviceRadio30">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>{{
                $t("lead-meter", { meterCount })
            }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-9') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions12" id="deviceRadio31" value="xml">
                <label class="form-check-label" for="deviceRadio31">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions12" id="deviceRadio32" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio32">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions12" id="deviceRadio33" value="csv">
                <label class="form-check-label" for="deviceRadio33">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              meters available</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mt-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-10') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions13" id="deviceRadio34" value="xml">
                <label class="form-check-label" for="deviceRadio34">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions13" id="deviceRadio35" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio35">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions13" id="deviceRadio36" value="csv">
                <label class="form-check-label" for="deviceRadio36">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: gatewayCount })
              }}
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card my-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-11') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions14" id="deviceRadio37" value="xml">
                <label class="form-check-label" for="deviceRadio37">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions14" id="deviceRadio38" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio38">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions14" id="deviceRadio39" value="csv">
                <label class="form-check-label" for="deviceRadio39">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: gwIECCount })
              }}
            </small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card my-4 shadow">
          <div class="card-body">
            <h5 class="card-title">{{ $t('download-card-12') }}</h5>
            <!-- Radio row 1 start -->
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions16" id="deviceRadio40" value="xml">
                <label class="form-check-label" for="deviceRadio40">XML</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions16" id="deviceRadio41" value="json"
                  checked>
                <label class="form-check-label" for="deviceRadio41">JSON</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions16" id="deviceRadio42" value="csv">
                <label class="form-check-label" for="deviceRadio42">CSV</label>
              </div>
            </div>
            <!-- Radio row 1 end -->
            <button type="button" class="btn btn-primary my-2 me-3" disabled>{{ $t('download-button-1') }} ⇩</button>
            <button type="button" class="btn btn-danger my-2">{{ $t('download-button-2') }}</button>
          </div>
          <div class="card-footer text-muted">
            <small>
              {{
                  $t("lead-gateway", { count: meterCount })
              }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

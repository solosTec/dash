<template>
  <div class="bg-light py-5">
    <div class="container">
      <h1>{{ $t('header-monitor-system') }}</h1>
      <p>{{
          $t("lead-monitor-system")
      }}
      </p>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="card card-big">
          <div class="card-body">
            <h5 class="card-title">CPU</h5>
            <p class="mt-3">
              CPU load
            </p>
            <div class="progress mt-3">
              <div class="progress-bar bg-success" role="progressbar" style="width: 20%"></div>
            </div>
          </div>
          <div class="card-footer text-muted">
            CPUs available
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-big">
          <div class="card-body">
            <h5 class="card-title">Memory</h5>
            <p class="mt-3">
              Memory load </p>
            <div class="progress mt-3">
              <div class="progress-bar bg-success" role="progressbar" style="width: 50%"></div>
            </div>
          </div>
          <div class="card-footer text-muted">
            GB memory are available
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-big">
          <div class="card-body">
            <h5 class="card-title">I/O</h5>
            <p>Bytes exchanged with server.
            </p>
            <p>32 GB received
            </p>
            <p>1.6 MB sent
            </p>
          </div>
          <div class="card-footer text-muted">
            32 GB in total
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

</script>

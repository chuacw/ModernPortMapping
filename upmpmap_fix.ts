import Debug from 'debug'

const debug = Debug('nat-api')

async function _pmpMapFix (opts) {
    if (this._destroyed) throw new Error('client is destroyed')
    debug(
      'Mapping public port %d to private port %d by %s using NAT-PMP',
      opts.publicPort,
      opts.privatePort,
      opts.protocol
    )

    // If we come from a timeouted (or error) request, we need to reconnect
    if (this._pmpClient && this._pmpClient.socket == null) {
      this._pmpClient = new NatPMP(this._pmpClient.gateway)
    }

    const pmpTimeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        this._pmpClient.close()
        const err = new Error('timeout')
        reject(err)
      }, 1000).unref?.()
    })

    try {
      await Promise.race([
        this._pmpClient.portMapping({
          public: opts.publicPort,
          private: opts.privatePort,
          description: opts.description, // fixes missing description chuacw 25 Jun 2024
          type: opts.protocol,
          ttl: opts.ttl
        }),
        pmpTimeout
      ])
    } catch (err) {
      this._pmpClient.close()
      debug(
        'Error mapping port %d:%d using NAT-PMP:',
        opts.publicPort,
        opts.privatePort,
        err.message
      )
      return false
    }

    if (this.autoUpdate) {
      this._pmpIntervals[
        opts.publicPort + ':' + opts.privatePort + '-' + opts.protocol
      ] = setInterval(
        async () => {
          try {
            await this._pmpMap.bind(this, opts)
          } catch (err) {
            // Handle any errors here
          }
        },
        this._timeout
      ).unref?.()
    }

    debug(
      'Port %d:%d for protocol %s mapped on router using NAT-PMP',
      opts.publicPort,
      opts.privatePort,
      opts.protocol
    )

    return true
  }

export {
    _pmpMapFix
}
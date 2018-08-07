
## API

### Internal log format

Logs are stored as JS Objects and serialized as JSON.

{}

##

    ## module syntax
    const logd = require('logd');
    const myModule = logd.module('aws-s3-bucket');




    // this is what you do in your application main file

    var   log           = require('logd').module('distributed')
        , LogFile       = require('logd-file')
        , ConsoleLogger = require('logd-console')
        , SQLLogger     = require('logd-sql')
        , LogMailer     = require('logd-mailer');


    var logfile = new LogFile({
          path: '/var/log/eventbooster.log'
        , retain: '1g'
    });


    var sqlLogger = new SQLLogger({
          host: ''
        , port: 990
        , user: ''
        , pass: ''
        , database: ''
        , schema: ''
        , table: ''
    });


    var logmailer = new LogMailer({
          host: ''
        , port: 990
        , user: ''
        , pass: ''
    });


    // write all levels to the logfile
    log.transport.add(logfile);


    //write all logs to an sql db, store not more than 10m records
    log.transport.add(sqlLogger);


    // mail 
    log.transport.add(logmailer).levels('exception', 'error').env('production');

    // console
    log.transport.add(new ConsoleLogger()).level('warn').andUp();

    
    // global unhandled error capturing
    log.captureUnhandled();



    // this is what you do in any other file of your module, it will return the correct logger instance
    var log = require('logd').module();

    // catch all unhandled errors inside the method
    log.catch(function() {


    });


    // add your custom levels
    log.addLevel('myLevel', 30);


    // defualt log levels
    log.emergency();
    log.alert();
    log.critical();
    log.error();
    log.warning();
    log.notice();
    log.info();
    log.debug();



    // informal logs for debugging purposes, cannot be deactivated
    log();
    log.success();
    log.highlight();
    log.wtf();
    log.nope();
    log.yup();



    // profiling
    log.time('slow-queries')
    log.timeEnd('slow-queries');


    if (log.timeEnd('slow-queries') > 500) {

    }


    // metrics are logger instances, you can write anything on them
    // that can be written on other logs, it has some more methods

    var myMetric = new log.Metric('http-request').id('uuidv4');


    myMetric.data({pathname: '/'}).time('internal-request');

    myMetric.time('internal-request').message('The service startet processing the message').data({
        service: 'user'
    });

    myMetric.timeEnd('internal-request');


    // get instance
    var myLoggerRecovered = log.metric('uuidv4');

    // metrics must be terminated
    myMetric.end();










    > log
    > found 6 apps with 5045 targets, please select targets [eventbooster]:
    >  eventbooster (pid 2345, uptime: 02:56:01)
    >  eventbosoter (pid 2345, uptime: 02:56:01)
    >  eventbooster 
    >    related
    >       dev
    >       slow-queries
    >       sql
    >    soa-service
    >    checkout
    >
    > select the desired log level [ALL]:
    >  all logs
    >  > debug
    >  > warn
    >  error
    >  success
    >  wtf 


the cli can trace single metric instances, it can jump forward an backward between them








# application level



    const Logd = require('logd');



    Logd.use(new MailTransport()).env('live').level.gte('warn');



    const log = require('logd').module('related');




    log.event('user-registred', {});



    log.warn('hui');



    --log-level=warn+ --log-sink=std --log-module=related,distributed




log.uid(reuest.uid).info();
// include configuration file.
Titanium.include( "config.js" );

var Barrel = {
    BASE_URI: "http://www.kactoos.com/api"
};

Barrel.Request = {
    toQueryString: function ( opts ) {
        if ( typeof opts != "object" ) {
            return null;
        }

        var stack = [], counter = 0;

        // TODO: add support for more than one level.
        for ( key in opts ) {
            var value = ( opts[key] || opts[key] === 0 ? encodeURIComponent( opts[key] ) : "" )
            stack[counter] = encodeURIComponent( key ) + "=" + value;
            counter++;
        }

        return stack.join( "&" );
    },
    path: function ( path, opts ) {
        if ( typeof opts == "undefined" ) {
            opts = {};
        }

        var f = opts["format"];delete opts["format"];

        if ( !f ) {
            f = "json";
        }

        var a = opts["a"];delete opts["a"];
        var k = opts["k"];delete opts["k"];

        var qs = Barrel.Request.toQueryString( opts );qs = qs ? "&" + qs : null;
        path = Barrel.BASE_URI + path + "?format=" + f + "&appName=" + a + "&apiKey=" + k + qs;
        return path;
    }
};

Barrel.UI = {
    statusInidicator: function ( message ) {
        if ( typeof message == "undefined" ) {
            message = "Cargando ...";
        }

        var indicator = Titanium.UI.createActivityIndicator( {
            bottom: 10,
            height: 50,
            width: 10,
            style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
            message: message
        } );

        return indicator;
    },
    alert: function ( message, buttons ) {
        if ( typeof message == "undefined" ) {
            message = "";
        }

        if ( typeof buttons == "undefined" ) {
            buttons = [];
        }

        var alertDialog = Titanium.UI.createAlertDialog( {
            title: "Atención",
            message: message,
            buttonNames: buttons
        } );

        return alertDialog;
    }
};

Barrel.Text = {
    cut: function ( text, length, tail ) {
        if ( !text ) {
            throw "text can notbe empty";
        }

        if ( typeof length == "undefined" ) {
            length = 100;
        }

        if ( typeof tail == "undefined" ) {
            tail = "...";
        }

        if ( text.length > length ) {
            for ( counter = 0; text.charAt( length + counter ) != " "; counter++ ) {
                if ( !text.charAt( length + counter ) ) {
                    return text;
                }
            }

            text = text.substring( 0, length ) + tail;
        }

        return text;
    },
    cleanUp: function ( text, lowerCase, glue ) {
        if ( !text ) {
            throw "text can notbe empty";
        }

        if ( typeof lowerCase == "undefined" ) {
            lowerCase = true;
        }

        if ( typeof glue == "undefined" ) {
            glue = "-";
        }

        text = text.replace( /[^a-zA-Z0-9_\s]/g, "" ).replace( /\s+/g, glue );

        if ( true == lowerCase ) {
            return text.toString().toLowerCase();
        }

        return text;
    },
    numberFormat: function ( number, decimals, dec_point, thousands_sep ) {
        // http://kevin.vanzonneveld.net
        // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +     bugfix by: Michael White (http://getsprink.com)
        // +     bugfix by: Benjamin Lupton
        // +     bugfix by: Allan Jensen (http://www.winternet.no)
        // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // +     bugfix by: Howard Yeend
        // +    revised by: Luke Smith (http://lucassmith.name)
        // +     bugfix by: Diogo Resende
        // +     bugfix by: Rival
        // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
        // +   improved by: davook
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +      input by: Jay Klehr
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +      input by: Amir Habibi (http://www.residence-mixte.com/)
        // +     bugfix by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Theriault
        // +      input by: Amirouche
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: number_format(1234.56);
        // *     returns 1: '1,235'
        // *     example 2: number_format(1234.56, 2, ',', ' ');
        // *     returns 2: '1 234,56'
        // *     example 3: number_format(1234.5678, 2, '.', '');
        // *     returns 3: '1234.57'
        // *     example 4: number_format(67, 2, ',', '.');
        // *     returns 4: '67,00'
        // *     example 5: number_format(1000);
        // *     returns 5: '1,000'
        // *     example 6: number_format(67.311, 2);
        // *     returns 6: '67.31'
        // *     example 7: number_format(1000.55, 1);
        // *     returns 7: '1,000.6'
        // *     example 8: number_format(67000, 5, ',', '.');
        // *     returns 8: '67.000,00000'
        // *     example 9: number_format(0.9, 0);
        // *     returns 9: '1'
        // *    example 10: number_format('1.20', 2);
        // *    returns 10: '1.20'
        // *    example 11: number_format('1.20', 4);
        // *    returns 11: '1.2000'
        // *    example 12: number_format('1.2000', 3);
        // *    returns 12: '1.200'
        // *    example 13: number_format('1 000,50', 2, '.', ' ');
        // *    returns 13: '100 050.00'
        number = (number+'').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
};

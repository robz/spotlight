define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var DeltaItemView = SingleStatView.extend({
    
    changeOnSelected: true,
    valueTag: 'p',

    render: function() { 
      SingleStatView.prototype.render.apply(this, arguments);
      this.$el.find('p:first').addClass('change impact-number');
      this.$el.find('p').removeClass('increase decrease no-change');
      this.$el.find('p').addClass(this.trend);
    },
    
    getValue: function() { 
      var model = this.collection.first().get('values').last();
      var change = this.getChange(model, this.stat.attr);
      this.trend = change.trend;
      return change.percentChange;
    },
    
    getLabel: function() { 
      var model = this.collection.first().get('values').last();
      return this.getChange(model, this.stat.attr).previousDate;
    },
    
    getValueSelected: function(selected) { 
      var change = this.getChange(selected.selectedModel, this.stat.attr);
      this.trend = change.trend;
      return change.percentChange;
    },
    
    getLabelSelected: function(selected) { 
       return this.getChange(selected.selectedModel, this.stat.attr).previousDate;
    },
    
    getChange: function (model, attr) {

      var previousValue = null, previousDate = null, trend = null, percentChange = null;
      var currentValue = model.get(attr);
      var currentDate = model.get('_start_at');
      
      // Get previous value from collection. 
      previousDate = currentDate.clone().subtract('months', 12);     
      var matchingValues = this.collection.first().get('values').find(function(d) {
        return (d.get('_start_at').valueOf() === previousDate.valueOf());
      });
      
      if (typeof matchingValues !== 'undefined') {
        previousValue = matchingValues.get(attr);
        if (previousValue) { 
          percentChange = (currentValue-previousValue) / previousValue;
          if (percentChange !== 0.0) {
            percentChange = this.formatPercentage(percentChange, 2, true);
          } else { 
            percentChange = 'no change';
          }
        }
        if (currentValue > previousValue) {
          trend = 'increase';
        } else if (currentValue < previousValue) { 
          trend = 'decrease';
        } else { 
          trend = 'no-change';
        }
      }
      
      return {
        previousDate: previousDate.format('MMM YYYY'), 
        percentChange: percentChange, 
        trend: trend
      };
  }
  
  });

  return DeltaItemView;
});
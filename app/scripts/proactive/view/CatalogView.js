define(
    [
        'jquery',
        'backbone',
        'text!proactive/templates/catalog-browser.html',
        'text!proactive/templates/catalog-list.html',
        'text!proactive/templates/catalog-bucket-id.html',
        'proactive/view/CatalogWorkflowItem',
        'proactive/model/CatalogBucketCollection',
        'proactive/model/CatalogWorkflowCollection',
    ],

    function ($, Backbone, catalogBrowser, catalogList, catalogCurrentBucket, CatalogWorkflowItem, catalogBucket, catalogWorkflow) {

    "use strict";

    return Backbone.View.extend({
        template: _.template(catalogBrowser),
        initialize: function (options) {
            this.$el = $("<div id='catalog-browser-container'></div>");
            $("#catalog-browser-body").append(this.$el);
            this.buckets = options.buckets;
            this.render();
        },
        events: {
            'change #select-bucket': 'switchBucket'
        },
        internalSwitchBucket: function (currentBucketID) {
            console.log('internalSwitchBucket called !');
            this.$('#catalog-workflow-list').empty();
            this.$('#current-id').empty();
            var currentID = _.template(catalogCurrentBucket);
            if (currentBucketID == -1) {
                this.$('#current-id').append(currentID({bucketid: "No Bucket Selected"}));
            }
            else {
                var currentBucket = this.buckets.get(currentBucketID);
                _(currentBucket.get("workflows").models).each(function (workflow) {
                    var catalogWorkflowItem = new CatalogWorkflowItem({model: workflow});
                    catalogWorkflowItem.render();
                    this.$('#catalog-workflow-list').append(catalogWorkflowItem.el);
                }, this);
                this.$('#current-id').append(currentID({bucketid: "Bucket" + currentBucketID}));
            }
        },
        switchBucket: function(e){
            this.internalSwitchBucket(e.target.value);
        },
        render: function () {
            this.$el.html(this.template());
            var BucketList = _.template(catalogList);
            var empty = '<ul class="breadcrumb"> <li class="active"><span>Current Bucket is: No Bucket Selected</span></li></ul>';
            _(this.buckets.models).each(function(bucket) {
                var id = bucket.get("id");
                this.$('#bucket-list select').append(BucketList({bucket: id}));
            }, this);
            // to open the browser on the "" Bucket
            this.internalSwitchBucket(-1);
            return this;
        },
    })

})

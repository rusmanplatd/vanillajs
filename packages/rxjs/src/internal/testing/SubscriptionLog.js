'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SubscriptionLog = void 0;
var SubscriptionLog = (function () {
  /**
   *
   * @param subscribedFrame
   * @param unsubscribedFrame
   */
  function SubscriptionLog(subscribedFrame, unsubscribedFrame) {
    if (unsubscribedFrame === void 0) {
      unsubscribedFrame = Infinity;
    }
    this.subscribedFrame = subscribedFrame;
    this.unsubscribedFrame = unsubscribedFrame;
  }
  return SubscriptionLog;
})();
exports.SubscriptionLog = SubscriptionLog;
//# sourceMappingURL=SubscriptionLog.js.map

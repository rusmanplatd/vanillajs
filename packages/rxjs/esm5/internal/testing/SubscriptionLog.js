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
export { SubscriptionLog };
//# sourceMappingURL=SubscriptionLog.js.map

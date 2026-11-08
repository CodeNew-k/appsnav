/* 星叶导航 · 交互脚本
   只做两件事：首页筛选、提交表单生成邮件。其余内容全部静态输出，保证可抓取。 */

(function () {
  "use strict";

  /* ---------- 首页筛选 ---------- */
  var chipWrap = document.getElementById("chips");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cards .card[data-k]"));
  var hint = document.getElementById("filterHint");
  var searchInput = document.querySelector('.search input[name="q"]');
  var current = "all";

  var picksSection = document.getElementById("picks");
  var guideSection = document.getElementById("guide-intro");

  function applyFilter() {
    var kw = (searchInput && searchInput.value || "").trim().toLowerCase();
    var shown = 0;
    var filtering = !!kw || current !== "all";

    cards.forEach(function (card) {
      var catOk = current === "all" || card.getAttribute("data-cat") === current;
      var kwOk = !kw || (card.getAttribute("data-k") || "").toLowerCase().indexOf(kw) > -1;
      var show = catOk && kwOk;
      card.style.display = show ? "" : "none";
      if (show) shown++;
    });

    document.querySelectorAll(".section[id^='cat-']").forEach(function (sec) {
      var visible = Array.prototype.slice.call(sec.querySelectorAll(".card")).some(function (c) {
        return c.style.display !== "none";
      });
      sec.style.display = visible ? "" : "none";
    });

    if (picksSection) picksSection.style.display = filtering ? "none" : "";
    if (guideSection) guideSection.style.display = filtering ? "none" : "";

    if (hint) {
      if (filtering) {
        var chips = chipWrap ? chipWrap.querySelectorAll(".chip") : [];
        var activeChip = null;
        Array.prototype.forEach.call(chips, function (c) {
          if (c.classList.contains("on")) activeChip = c;
        });
        var label = [];
        if (current !== "all") label.push("分类：" + (activeChip ? activeChip.textContent.trim() : current));
        if (kw) label.push("关键词：" + kw);
        hint.style.display = "block";
        hint.textContent = label.join("，") + "，命中 " + shown + " 个条目" +
          (shown === 0 ? "。换个词试试，或点“全部”重置。" : "。");
      } else {
        hint.style.display = "none";
        hint.textContent = "";
      }
    }

    var empty = document.getElementById("emptyState");
    if (!empty) {
      empty = document.createElement("div");
      empty.id = "emptyState";
      empty.className = "empty";
      empty.textContent = "没有匹配的条目。可以换个说法，或从左侧分类里翻一遍。";
      var host = document.querySelector(".section[id^='cat-']");
      if (host && host.parentNode) host.parentNode.insertBefore(empty, host);
      else if (chipWrap && chipWrap.parentNode) chipWrap.parentNode.appendChild(empty);
    }
    empty.style.display = shown === 0 ? "block" : "none";
  }

  if (chipWrap && cards.length) {
    chipWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      chipWrap.querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("on", c === btn);
      });
      current = btn.getAttribute("data-filter") || "all";
      applyFilter();
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }

    var params = new URLSearchParams(window.location.search);
    var initial = (params.get("q") || "").trim();
    if (initial && searchInput) {
      searchInput.value = initial;
      applyFilter();
    }
  }

  /* ---------- 提交收录：生成邮件 ---------- */
  var form = document.getElementById("submitForm");
  if (form) {
    var result = document.getElementById("formResult");
    var resultText = document.getElementById("resultText");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#fName").value.trim();
      var url = form.querySelector("#fUrl").value.trim();
      var cat = form.querySelector("#fCat").value;
      var desc = form.querySelector("#fDesc").value.trim();
      var mail = form.querySelector("#fMail").value.trim();

      if (!name || !url || !desc || !mail) {
        alert("请把名称、官网地址、说明和联系邮箱填完整。");
        return;
      }
      if (!/^https?:\/\/.+\..+/i.test(url)) {
        alert("官网地址需要以 http:// 或 https:// 开头，并包含域名。");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        alert("联系邮箱格式看起来不对，检查一下 @ 前后的部分。");
        return;
      }

      var body = [
        "工具名称：" + name,
        "官网地址：" + url,
        "建议分类：" + cat,
        "说明：" + desc,
        "联系邮箱：" + mail
      ].join("\n");

      var subject = "【收录提交】" + name;
      var href = "mailto:admin@appsnav.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (resultText) {
        resultText.value = "收件人：admin@appsnav.com\n主题：" + subject + "\n\n" + body;
      }
      if (result) {
        result.style.display = "block";
        result.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      window.location.href = href;
    });
  }
})();

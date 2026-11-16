document.addEventListener("DOMContentLoaded", () => {
  const QUESTIONS = [
    {q:"Selon notre thème, que signifie le sens d’une communication ?",a:["Le message envoyé","La réponse obtenue","Le ton utilisé","La durée du dialogue"],correct:1,ex:"Le résultat de la communication se voit dans la réponse obtenue."},
    {q:"Si notre interlocuteur ne comprend pas le message, que faire ?",a:["Répéter plus fort","Arrêter la discussion","Reformuler autrement","Le blâmer"],correct:2,ex:"Changer sa façon d’expliquer peut aider à être compris."},
    {q:"Lequel est un élément de communication non verbale ?",a:["Le regard","Le vocabulaire","Une phrase écrite","Une définition"],correct:0,ex:"Le regard, les gestes et la posture transmettent aussi des messages."},
    {q:"Quel comportement montre une écoute active ?",a:["Interrompre souvent","Regarder son téléphone","Préparer uniquement sa réponse","Écouter puis reformuler"],correct:3,ex:"Reformuler permet de vérifier qu’on a bien compris."},
    {q:"Un collègue fait une erreur. Quelle phrase est constructive ?",a:["Tu es incapable !","Voyons comment corriger cette erreur.","Tu fais toujours n’importe quoi.","Je ne veux plus travailler avec toi."],correct:1,ex:"On se concentre sur la solution plutôt que sur la personne."},
    {q:"Le ton de la voix peut changer l’interprétation d’un message.",a:["Vrai","Faux"],correct:0,ex:"Le ton, le rythme et le volume influencent la perception."},
    {q:"Une communication efficace signifie toujours parler plus que son interlocuteur.",a:["Vrai","Faux"],correct:1,ex:"Une bonne communication implique aussi l’écoute et l’échange."},
    {q:"Pourquoi le message change-t-il souvent dans le jeu du téléphone arabe ?",a:["À cause des transmissions successives","À cause du temps uniquement","À cause du nombre de joueurs seulement","À cause du silence"],correct:0,ex:"Chaque personne peut interpréter ou transformer une partie du message."},
    {q:"Après avoir donné une consigne importante, que faut-il vérifier ?",a:["Que tout le monde a parlé","Que la consigne était rapide","Que le message a été compris","Que la consigne était longue"],correct:2,ex:"Demander une reformulation permet de vérifier la compréhension."},
    {q:"Si la réponse obtenue n’est pas celle souhaitée, quelle attitude adopter ?",a:["Blâmer l’autre","Adapter sa communication","Ignorer la situation","Répéter exactement la même chose"],correct:1,ex:"Le message-clé : si la réponse n’est pas celle attendue, communiquons différemment."}
  ];

  const $ = id => document.getElementById(id);
  const home = $("screen-home"), quiz = $("screen-quiz"), result = $("screen-result");
  let index = 0, score = 0, timer = null, seconds = 20, answered = false, player = "", history = [];

  function show(el) {
    [home, quiz, result].forEach(s => { if (s) s.classList.add("hidden"); });
    if (el) el.classList.remove("hidden");
  }

  function start() {
    player = $("playerName").value.trim() || "Participant";
    index = 0;
    score = 0;
    history = [];
    show(quiz);
    renderQuestion();
  }

  $("startBtn").addEventListener("click", start);
  $("playerName").addEventListener("keydown", e => { if (e.key === "Enter") start(); });

  function renderQuestion() {
    clearInterval(timer);
    answered = false;
    seconds = 20;
    const q = QUESTIONS[index];
    $("questionCount").textContent = `QUESTION ${index + 1} / ${QUESTIONS.length}`;
    $("scoreBadge").textContent = `${score} pts`;
    $("progressBar").style.width = `${(index / QUESTIONS.length) * 100}%`;
    $("timer").textContent = seconds;
    $("questionText").textContent = q.q;
    $("answers").innerHTML = "";
    $("feedback").classList.add("hidden");
    $("nextBtn").classList.add("hidden");

    q.a.forEach((answer, i) => {
      const b = document.createElement("button");
      b.className = "answer";
      b.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${answer}</span>`;
      b.addEventListener("click", () => choose(i));
      $("answers").appendChild(b);
    });

    timer = setInterval(() => {
      seconds--;
      $("timer").textContent = seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        choose(-1);
      }
    }, 1000);
  }

  function choose(choice) {
    if (answered) return;
    answered = true;
    clearInterval(timer);
    const q = QUESTIONS[index];
    const correct = choice === q.correct;
    if (correct) score += 10;
    history.push({ choice, correct });

    [...$("answers").children].forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add("correct");
      else if (i === choice) b.classList.add("wrong");
    });

    const fb = $("feedback");
    fb.classList.remove("hidden", "bad");
    if (!correct) fb.classList.add("bad");
    fb.textContent = (choice === -1 ? "⏱️ Temps écoulé. " : "") + (correct ? "✓ Bonne réponse ! " : "✗ Pas tout à fait. ") + q.ex;

    $("scoreBadge").textContent = `${score} pts`;
    $("nextBtn").textContent = index === QUESTIONS.length - 1 ? "Voir mon résultat →" : "Question suivante →";
    $("nextBtn").classList.remove("hidden");
  }

  $("nextBtn").addEventListener("click", () => {
    index++;
    if (index < QUESTIONS.length) renderQuestion();
    else finish();
  });

  function finish() {
    clearInterval(timer);
    show(result);
    $("finalScore").textContent = score;
    $("resultBar").style.width = score + "%";
    $("resultSubtitle").textContent = `Bravo ${player} ! Voici votre résultat.`;
    
    // --- ENVOI DES RÉSULTATS VERS GOOGLE SHEETS / EMAIL ---
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwo2l2twE1APUG7ygDeZ3bNbZHitZw6hywdImB8F7DGZTqjR3pMkDUGQ3y23HLfx4BKNQ/exec";
    
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ player: player, score: score })
    }).catch(error => console.error("Erreur d'envoi :", error));
    // -----------------------------------------------------

    let title, msg;
    if (score <= 30) {
      title = "Débutant";
      msg = "Les bases sont à découvrir : écoutez, clarifiez et osez reformuler.";
    } else if (score <= 60) {
      title = "En progression";
      msg = "Vous avancez ! Quelques réflexes de communication peuvent encore être renforcés.";
    } else if (score <= 80) {
      title = "Communicateur confirmé";
      msg = "Très bon résultat. Vous avez compris l’importance de l’écoute et de l’adaptation.";
    } else {
      title = "Expert du dialogue";
      msg = "Excellent ! Vous avez les bons réflexes pour communiquer avec intention.";
    }
    $("resultTitle").textContent = title;
    $("resultMessage").textContent = msg;
    $("review").classList.add("hidden");
    $("reviewBtn").textContent = "Voir les réponses";
  }

  $("restartBtn").addEventListener("click", () => {
    show(home);
    $("playerName").value = player;
  });

  $("reviewBtn").addEventListener("click", () => {
    const r = $("review");
    if (!r.classList.contains("hidden")) {
      r.classList.add("hidden");
      $("reviewBtn").textContent = "Voir les réponses";
      return;
    }
    r.innerHTML = QUESTIONS.map((q, i) => `<div class="review-item"><strong>${i + 1}. ${q.q}</strong><span class="good">Réponse : ${q.a[q.correct]}</span><br><span>${q.ex}</span></div>`).join("");
    r.classList.remove("hidden");
    $("reviewBtn").textContent = "Masquer les réponses";
  });
});

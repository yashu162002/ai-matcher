from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(resumes, job):
    results = []

    # ✅ Convert skills list to a single string
    job_text = " ".join(job.requiredSkills)

    resume_texts = [
        " ".join(resume.skills) for resume in resumes
    ]

    # Combine job + resumes
    documents = [job_text] + resume_texts

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # First vector = job
    job_vector = tfidf_matrix[0]

    # Remaining vectors = resumes
    resume_vectors = tfidf_matrix[1:]

    # Cosine similarity
    similarities = cosine_similarity(job_vector, resume_vectors)[0]

    # Prepare results
    for i, score in enumerate(similarities):
        results.append({
            "resumeId": resumes[i].id,
            "candidateEmail": resumes[i].candidateEmail,
            "matchScore": round(float(score) * 100, 2)
        })

    # Sort by highest score
    results.sort(
        key=lambda x: x["matchScore"],
        reverse=True
    )

    return results
